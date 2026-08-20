const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Invoice = require("../models/Invoice");
const WebhookEvent = require("../models/WebhookEvent");
const {
    sendInvoiceReceiptEmail
} = require("../services/emailService");

const {
    generateInvoiceReceipt
} = require("../services/pdfService");

const handleStripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    // =========================================
    // 1. VERIFY STRIPE WEBHOOK SIGNATURE
    // =========================================

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error(
            "Webhook signature verification failed:",
            error.message
        );

        return res.status(400).json({
            message: "Webhook signature verification failed"
        });
    }

    try {
        // =========================================
        // 2. CHECK FOR DUPLICATE EVENT
        // =========================================

        const existingEvent = await WebhookEvent.findOne({
            eventId: event.id
        });

        if (existingEvent) {
            console.log(
                `Duplicate Stripe event ignored: ${event.id}`
            );

            return res.status(200).json({
                received: true,
                duplicate: true
            });
        }

        // =========================================
        // 3. HANDLE STRIPE EVENTS
        // =========================================

        switch (event.type) {

            // =====================================
            // SUCCESSFUL CHECKOUT
            // =====================================

            case "checkout.session.completed": {

                const session = event.data.object;

                console.log(
                    "Checkout session completed:",
                    session.id
                );

                const invoiceId =
                    session.metadata?.invoiceId;

                if (!invoiceId) {
                    console.log(
                        "No invoiceId found in session metadata"
                    );
                    break;
                }

                const invoice =
                    await Invoice.findById(invoiceId);

                if (!invoice) {
                    console.log(
                        "Invoice not found:",
                        invoiceId
                    );
                    break;
                }

                // =================================
                // VERIFY PAYMENT STATUS
                // =================================

                if (session.payment_status !== "paid") {

                    console.log(
                        `Payment not completed for invoice ${invoice.invoiceNumber}`
                    );

                    break;
                }

                // =================================
                // PREVENT DUPLICATE PAYMENT
                // =================================

                if (invoice.status === "paid") {

                    console.log(
                        `Invoice ${invoice.invoiceNumber} is already paid`
                    );

                    break;
                }

                // =================================
                // MARK INVOICE AS PAID
                // =================================

                invoice.status = "paid";
                invoice.paidAt = new Date();

                // Store Stripe PaymentIntent ID
                if (session.payment_intent) {

                    invoice.stripePaymentIntentId =
                        session.payment_intent;
                }

                await invoice.save();

                console.log(
                    `Invoice ${invoice.invoiceNumber} marked as paid`
                );

                // =================================
                // GENERATE PAYMENT RECEIPT PDF
                // =================================

                try {

    const pdfPath =
        await generateInvoiceReceipt(
            invoice
        );

    console.log(
        `Payment receipt generated: ${pdfPath}`
    );

    // =========================================
    // SEND RECEIPT EMAIL
    // =========================================

    try {

        await sendInvoiceReceiptEmail(
    invoice,
    pdfPath
);

        console.log(
            `Receipt email sent successfully to ${invoice.clientEmail}`
        );

    } catch (emailError) {

        console.error(
            "Receipt email failed:",
            emailError.message
        );
    }

} catch (pdfError) {

    console.error(
        "PDF receipt generation failed:",
        pdfError.message
    );
}

                break;
            }

            // =====================================
            // FAILED PAYMENT
            // =====================================

            case "payment_intent.payment_failed": {

                const paymentIntent =
                    event.data.object;

                console.log(
                    "Payment failed:",
                    paymentIntent.id
                );

                const invoiceId =
                    paymentIntent.metadata?.invoiceId;

                if (!invoiceId) {

                    console.log(
                        "No invoiceId found in failed payment metadata"
                    );

                    break;
                }

                const invoice =
                    await Invoice.findById(invoiceId);

                if (!invoice) {

                    console.log(
                        "Invoice not found:",
                        invoiceId
                    );

                    break;
                }

                // Keep invoice unpaid
                invoice.status = "pending";
                invoice.paidAt = null;

                // Store failed PaymentIntent ID
                invoice.stripePaymentIntentId =
                    paymentIntent.id;

                await invoice.save();

                console.log(
                    `Payment failed for invoice ${invoice.invoiceNumber}`
                );

                break;
            }

            // =====================================
            // OTHER STRIPE EVENTS
            // =====================================

            default: {

                console.log(
                    `Unhandled Stripe event: ${event.type}`
                );
            }
        }

        // =========================================
        // 4. SAVE PROCESSED WEBHOOK EVENT
        // =========================================

        await WebhookEvent.create({
            eventId: event.id,
            eventType: event.type
        });

        console.log(
            `Stripe event processed successfully: ${event.id}`
        );

        // =========================================
        // 5. SEND SUCCESS RESPONSE TO STRIPE
        // =========================================

        return res.status(200).json({
            received: true
        });

    } catch (error) {

        console.error(
            "Webhook processing error:",
            error.message
        );

        return res.status(500).json({
            message: "Webhook processing failed"
        });
    }
};

module.exports = {
    handleStripeWebhook
};