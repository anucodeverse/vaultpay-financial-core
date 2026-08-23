const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

const protect = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");

const app = express();

app.use(cors());

// =========================================
// STRIPE WEBHOOK
// MUST USE RAW BODY
// =========================================

app.use("/api/webhooks", webhookRoutes);
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "VaultPay Financial Core API is running"
    });
});

app.get(
    "/api/protected",
    protect,
    (req, res) => {
        res.json({
            message: "You accessed a protected route",
            user: req.user
        });
    }
);

app.get(
    "/api/admin-test",
    protect,
    authorizeRoles("admin"),
    (req, res) => {
        res.json({
            message: "Welcome Admin",
            user: req.user
        });
    }
);

app.get("/api/invoice-test", (req, res) => {
    res.json({
        message: "Invoice test route works"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`VaultPay server running on port ${PORT}`);
});