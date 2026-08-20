const stripe = require("../config/stripe");
const Invoice = require("../models/Invoice");

const createCheckoutSession = async (req, res) => {
    try {
        const { invoiceId } = req.body;

        if (!invoiceId) {
            return res.status(400).json({
                message: "invoiceId is required"
            });
        }

        // Find invoice
        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        // Client can only pay their own invoice
        if (
            req.user.role === "client" &&
            invoice.client.toString() !== req.user.id
        ) {
            return res.status(403).json({
                message: "Forbidden: You do not have access to this invoice"
            });
        }

        // Don't allow payment for an already-paid invoice
        if (invoice.status === "paid") {
            return res.status(400).json({
                message: "Invoice is already paid"
            });
        }

        // Stripe expects amount in cents
        const amountInCents = Math.round(invoice.amount * 100);

        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            payment_method_types: ["card"],

            line_items: [
                {
                    price_data: {
                        currency: invoice.currency,
                        product_data: {
                            name: invoice.description,
                            description: `Invoice ${invoice.invoiceNumber}`
                        },
                        unit_amount: amountInCents
                    },
                    quantity: 1
                }
            ],

            customer_email: invoice.clientEmail,

            // Metadata on Checkout Session
            metadata: {
                invoiceId: invoice._id.toString()
            },

            // Metadata on PaymentIntent
            // Needed for payment_intent.payment_failed
            payment_intent_data: {
                metadata: {
                    invoiceId: invoice._id.toString()
                }
            },

            success_url:
                "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",

            cancel_url:
                "http://localhost:5173/payment-cancelled"
        });

        res.status(200).json({
            message: "Checkout session created successfully",
            checkoutUrl: session.url,
            sessionId: session.id
        });

    } catch (error) {
        console.error(
            "Create checkout session error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while creating checkout session"
        });
    }
};

module.exports = {
    createCheckoutSession
};