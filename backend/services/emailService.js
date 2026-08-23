const nodemailer = require("nodemailer");

console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Check SMTP connection when server starts
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Gmail SMTP connection failed:");
        console.error(error);
    } else {
        console.log("✅ Gmail SMTP connection is ready");
    }
});

const sendInvoiceReceipt = async (invoice, pdfPath) => {

    try {

        console.log("=================================");
        console.log("📧 Starting receipt email");
        console.log("To:", invoice.clientEmail);
        console.log("From:", process.env.EMAIL_USER);
        console.log("PDF:", pdfPath);
        console.log("Invoice:", invoice.invoiceNumber);
        console.log("=================================");

        const mailOptions = {

            from: `"VaultPay" <${process.env.EMAIL_USER}>`,

            to: invoice.clientEmail,

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
                    path: pdfPath
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("✅ RECEIPT EMAIL SENT");
        console.log("Message ID:", info.messageId);
        console.log("Response:", info.response);

        return info;

    } catch (error) {

        console.error("❌ RECEIPT EMAIL FAILED");
        console.error("Error code:", error.code);
        console.error("Error command:", error.command);
        console.error("Error response:", error.response);
        console.error("Error message:", error.message);

        throw error;
    }
};

module.exports = {
    sendInvoiceReceiptEmail: sendInvoiceReceipt
};