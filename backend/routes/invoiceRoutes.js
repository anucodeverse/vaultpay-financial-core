const express = require("express");

const {
    createInvoice,
    getAllInvoices,
    getMyInvoices,
    getInvoiceById,
    createCheckoutSession
} = require("../controllers/invoiceController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin: Create invoice
router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createInvoice
);

// Client: Get own invoices
router.get(
    "/my",
    protect,
    authorizeRoles("client"),
    getMyInvoices
);
router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getAllInvoices
);

// Admin/Client: Get invoice by ID
router.get(
    "/:id",
    protect,
    authorizeRoles("admin", "client"),
    getInvoiceById
);
router.post(
    "/:id/checkout",
    protect,
    authorizeRoles("client"),
    createCheckoutSession
);
module.exports = router;