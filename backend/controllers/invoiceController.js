const Invoice = require("../models/Invoice");
const User = require("../models/User");
const stripe = require("../config/stripe");

const createInvoice = async (req, res) => {
    try {
        const {
            clientId,
            description,
            amount,
            dueDate
        } = req.body;

        // Validate required fields
        if (!clientId || !description || !amount || !dueDate) {
            return res.status(400).json({
                message:
                    "clientId, description, amount, and dueDate are required"
            });
        }

        // Make sure the selected user exists
        const client = await User.findById(clientId);

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        // Make sure the selected user is actually a client
        if (client.role !== "client") {
            return res.status(400).json({
                message: "Invoice can only be assigned to a client"
            });
        }

        // Generate invoice number
        const invoiceNumber = `INV-${Date.now()}`;

        const invoice = await Invoice.create({
            invoiceNumber,
            client: client._id,
            clientName: client.name,
            clientEmail: client.email,
            description,
            amount,
            dueDate
        });

        res.status(201).json({
            message: "Invoice created successfully",
            invoice
        });

    } catch (error) {
        console.error(
            "Create invoice error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while creating invoice"
        });
    }
};


const getMyInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({
            client: req.user.id
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            message: "Invoices retrieved successfully",
            invoices
        });

    } catch (error) {
        console.error(
            "Get my invoices error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while retrieving invoices"
        });
    }
};


const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findById(id);

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        // Admin can view any invoice
        if (req.user.role === "admin") {
            return res.status(200).json({
                message:
                    "Invoice retrieved successfully",
                invoice
            });
        }

        // Client can only view their own invoice
        if (
            invoice.client.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message:
                    "Forbidden: You do not have access to this invoice"
            });
        }

        res.status(200).json({
            message:
                "Invoice retrieved successfully",
            invoice
        });

    } catch (error) {
        console.error(
            "Get invoice error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while retrieving invoice"
        });
    }
};


const createCheckoutSession = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findById(id);

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        // Only the invoice owner can pay
        if (
            invoice.client.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message:
                    "Forbidden: You do not have access to this invoice"
            });
        }

        // Prevent paying an already-paid invoice
        if (invoice.status === "paid") {
            return res.status(400).json({
                message: "Invoice is already paid"
            });
        }

        // Make sure frontend URL exists
        if (!process.env.FRONTEND_URL) {
            console.error(
                "FRONTEND_URL environment variable is missing"
            );

            return res.status(500).json({
                message:
                    "Payment configuration error"
            });
        }

        const session =
            await stripe.checkout.sessions.create({

                mode: "payment",

                payment_method_types: ["card"],

                line_items: [
                    {
                        price_data: {
                            currency:
                                invoice.currency,

                            product_data: {
                                name:
                                    invoice.invoiceNumber,

                                description:
                                    invoice.description
                            },

                            unit_amount:
                                Math.round(
                                    invoice.amount * 100
                                )
                        },

                        quantity: 1
                    }
                ],

                customer_email:
                    invoice.clientEmail,

                metadata: {
                    invoiceId:
                        invoice._id.toString()
                },

                success_url:
                    `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

                cancel_url:
                    `${process.env.FRONTEND_URL}/payment-cancelled`
            });

        res.status(200).json({
            message:
                "Checkout session created successfully",

            checkoutUrl:
                session.url,

            sessionId:
                session.id
        });

    } catch (error) {

        console.error(
            "Create checkout session error:",
            error.message
        );

        res.status(500).json({
            message:
                "Unable to create checkout session"
        });
    }
};


const getAllInvoices = async (req, res) => {
    try {

        const invoices = await Invoice.find()
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            message:
                "All invoices retrieved successfully",

            invoices
        });

    } catch (error) {

        console.error(
            "Get all invoices error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while retrieving invoices"
        });
    }
};


module.exports = {
    createInvoice,
    getAllInvoices,
    getMyInvoices,
    getInvoiceById,
    createCheckoutSession
};