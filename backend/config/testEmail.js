require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const testEmail = async () => {
    try {
        console.log("Testing Gmail connection...");

        await transporter.verify();

        console.log("Gmail SMTP connection successful.");

        const info = await transporter.sendMail({
            from: `"VaultPay" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: "VaultPay Email Test",
            text: "This is a test email from VaultPay."
        });

        console.log("Test email sent successfully.");
        console.log("Message ID:", info.messageId);

    } catch (error) {
        console.error("Email test failed:");
        console.error(error.message);
    }
};

testEmail();