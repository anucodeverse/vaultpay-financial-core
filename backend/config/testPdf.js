require("dotenv").config();

const Invoice = require("../models/Invoice");
const connectDB = require("./db");

const {
    generateInvoiceReceipt
} = require("../services/pdfService");

const testPdf = async () => {
    try {
        await connectDB();

        const invoice = await Invoice.findOne({
            status: "paid"
        }).sort({
            paidAt: -1
        });

        if (!invoice) {
            console.log("No paid invoice found.");
            process.exit(0);
        }

        console.log(
            `Generating receipt for ${invoice.invoiceNumber}...`
        );

        const filePath =
            await generateInvoiceReceipt(invoice);

        console.log(
            "PDF generated successfully:"
        );

        console.log(filePath);

        process.exit(0);

    } catch (error) {
        console.error(
            "PDF generation failed:",
            error
        );

        process.exit(1);
    }
};

testPdf();