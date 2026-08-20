const express = require("express");

const {
    handleStripeWebhook
} = require("../controllers/webhookController");

const router = express.Router();

// Stripe webhook must receive raw body
router.post(
    "/stripe",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
);

module.exports = router;