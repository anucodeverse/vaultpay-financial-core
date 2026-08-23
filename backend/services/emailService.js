const fs = require("fs");
const path = require("path");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Sender email
// IMPORTANT:
// Use a sender address/domain that Resend allows you to send from.
// For initial testing, you can use the Resend onboarding sender if available.
const FROM_EMAIL = process.env.EMAIL_FROM || "onboarding@resend.dev";

console.log("=================================");
console.log("📧 Email Service Configuration");
console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
console.log("EMAIL_FROM:", FROM_EMAIL);
console.log("=================================");

const sendInvoiceReceipt = async (invoice, pdfPath) => {
    try {
        console.log("=================================");
        console.log("📧 Starting receipt email");
        console.log("To:", invoice.clientEmail);
        console.log("From:", FROM_EMAIL);
        console.log("PDF:", pdfPath);
        console.log("Invoice:", invoice.invoiceNumber);
        console.log("=================================");

        // Check that the PDF exists before sending
        if (!fs.existsSync(pdfPath)) {
            throw new Error(`PDF file not found: ${pdfPath}`);
        }

        // Read PDF and convert it to Base64
        const pdfBuffer = fs.readFileSync(pdfPath);
        const pdfBase64 = pdfBuffer.toString("base64");

        const { data, error } = await resend.emails.send({
            from: `VaultPay <${FROM_EMAIL}>`,

            to: [invoice.clientEmail],

            subject: `Payment Receipt - ${invoice.invoiceNumber}`,

            text: `
Hello ${invoice.clientName},

Your payment for invoice ${invoice.invoiceNumber} has been successfully received.

Invoice: ${invoice.invoiceNumber}
Amount: ${invoice.amount} ${invoice.currency.toUpperCase()}
Status: PAID

Thank you for your payment.

Regards,
VaultPay
Nexus Corporate Services
            `,

            html: `
                <h2>Payment Successful</h2>

                <p>Hello ${invoice.clientName},</p>

                <p>
                    Your payment for invoice
                    <strong>${invoice.invoiceNumber}</strong>
                    has been successfully received.
                </p>

                <p>
                    <strong>Invoice:</strong> ${invoice.invoiceNumber}<br>
                    <strong>Amount:</strong> ${invoice.amount} ${invoice.currency.toUpperCase()}<br>
                    <strong>Status:</strong> PAID
                </p>

                <p>
                    Your payment receipt is attached to this email.
                </p>

                <p>
                    Regards,<br>
                    <strong>VaultPay</strong><br>
                    Nexus Corporate Services
                </p>
            `,

            attachments: [
                {
                    filename: `${invoice.invoiceNumber}-receipt.pdf`,
                    content: pdfBase64
                }
            ]
        });

        if (error) {
            console.error("❌ RESEND EMAIL FAILED");
            console.error(error);
            throw error;
        }

        console.log("✅ RECEIPT EMAIL SENT");
        console.log("Resend Email ID:", data.id);

        return data;

    } catch (error) {
        console.error("❌ RECEIPT EMAIL FAILED");
        console.error("Error message:", error.message);

        throw error;
    }
};

module.exports = {
    sendInvoiceReceiptEmail: sendInvoiceReceipt
};