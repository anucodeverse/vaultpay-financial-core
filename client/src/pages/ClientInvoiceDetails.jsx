import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
    getInvoiceById,
    createCheckoutSession
} from "../services/invoiceService";
import "./ClientInvoiceDetails.css";

const ClientInvoiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [paymentLoading, setPaymentLoading] = useState(false);

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const fetchInvoice = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getInvoiceById(id);

            setInvoice(data.invoice);
        } catch (error) {
            console.error(
                "Failed to fetch invoice:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to load invoice details."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================
    // FORMAT CURRENCY
    // =========================================

    const formatAmount = (amount, currency) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency?.toUpperCase() || "USD"
        }).format(amount);
    };

    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    // =========================================
    // STATUS CLASS
    // =========================================

    const getStatusClass = (status) => {
        switch (status) {
            case "paid":
                return "client-detail-status client-detail-status-paid";

            case "pending":
                return "client-detail-status client-detail-status-pending";

            case "failed":
                return "client-detail-status client-detail-status-failed";

            default:
                return "client-detail-status";
        }
    };

    // =========================================
    // PAY NOW
    // =========================================

    const handlePayNow = async () => {
        try {
            setPaymentLoading(true);
            setError("");

            const data = await createCheckoutSession(id);

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                setError("Unable to create payment session.");
            }
        } catch (error) {
            console.error(
                "Payment error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to start payment."
            );

            setPaymentLoading(false);
        }
    };

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div className="client-invoice-details-page">

                <Navbar />

                <main className="client-invoice-details-container">

                    <div className="client-invoice-loading">
                        Loading invoice details...
                    </div>

                </main>

            </div>
        );
    }

    // =========================================
    // ERROR
    // =========================================

    if (error && !invoice) {
        return (
            <div className="client-invoice-details-page">

                <Navbar />

                <main className="client-invoice-details-container">

                    <button
                        className="client-back-button"
                        onClick={() => navigate("/client")}
                    >
                        ← Back to Dashboard
                    </button>

                    <div className="client-invoice-error">

                        <h2>
                            Unable to Load Invoice
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            className="client-retry-button"
                            onClick={fetchInvoice}
                        >
                            Try Again
                        </button>

                    </div>

                </main>

            </div>
        );
    }

    return (
        <div className="client-invoice-details-page">

            <Navbar />

            <main className="client-invoice-details-container">

                {/* =========================================
                    BACK BUTTON
                ========================================= */}

                <button
                    className="client-back-button"
                    onClick={() => navigate("/client")}
                >
                    ← Back to Dashboard
                </button>


                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="client-invoice-details-header">

                    <div>

                        <p className="client-details-label">
                            Invoice
                        </p>

                        <h1>
                            {invoice.invoiceNumber}
                        </h1>

                        <p>
                            Review your invoice details and payment status.
                        </p>

                    </div>

                    <span
                        className={getStatusClass(
                            invoice.status
                        )}
                    >
                        {invoice.status}
                    </span>

                </div>


                {/* =========================================
                    PAYMENT ERROR
                ========================================= */}

                {error && (
                    <div className="client-payment-error">
                        {error}
                    </div>
                )}


                {/* =========================================
                    MAIN CARD
                ========================================= */}

                <div className="client-invoice-details-card">

                    {/* =========================================
                        AMOUNT
                    ========================================= */}

                    <div className="client-invoice-amount-section">

                        <span className="client-details-label">
                            Amount Due
                        </span>

                        <strong>
                            {formatAmount(
                                invoice.amount,
                                invoice.currency
                            )}
                        </strong>

                        <span className="client-due-date">
                            Due {formatDate(invoice.dueDate)}
                        </span>

                    </div>


                    {/* =========================================
                        INVOICE INFORMATION
                    ========================================= */}

                    <div className="client-details-section">

                        <h2>
                            Invoice Information
                        </h2>

                        <div className="client-details-grid">

                            <div className="client-detail-item">

                                <span className="client-details-label">
                                    Invoice Number
                                </span>

                                <strong>
                                    {invoice.invoiceNumber}
                                </strong>

                            </div>


                            <div className="client-detail-item">

                                <span className="client-details-label">
                                    Status
                                </span>

                                <span
                                    className={getStatusClass(
                                        invoice.status
                                    )}
                                >
                                    {invoice.status}
                                </span>

                            </div>


                            <div className="client-detail-item">

                                <span className="client-details-label">
                                    Description
                                </span>

                                <strong>
                                    {invoice.description || "-"}
                                </strong>

                            </div>


                            <div className="client-detail-item">

                                <span className="client-details-label">
                                    Created Date
                                </span>

                                <strong>
                                    {formatDate(invoice.createdAt)}
                                </strong>

                            </div>


                            <div className="client-detail-item">

                                <span className="client-details-label">
                                    Due Date
                                </span>

                                <strong>
                                    {formatDate(invoice.dueDate)}
                                </strong>

                            </div>


                            <div className="client-detail-item">

                                <span className="client-details-label">
                                    Currency
                                </span>

                                <strong>
                                    {invoice.currency?.toUpperCase() || "USD"}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* =========================================
                        PAYMENT SECTION
                    ========================================= */}

                    <div className="client-payment-section">

                        {invoice.status === "paid" ? (

                            <div className="client-paid-message">

                                <div className="client-paid-icon">
                                    ✓
                                </div>

                                <div>
                                    <strong>
                                        Payment Completed
                                    </strong>

                                    <p>
                                        This invoice has already been paid.
                                    </p>
                                </div>

                            </div>

                        ) : (

                            <div className="client-pay-area">

                                <div>

                                    <h2>
                                        Ready to Pay?
                                    </h2>

                                    <p>
                                        Continue securely with Stripe Checkout.
                                    </p>

                                </div>

                                <button
                                    className="client-pay-button"
                                    onClick={handlePayNow}
                                    disabled={paymentLoading}
                                >
                                    {paymentLoading
                                        ? "Redirecting..."
                                        : "Pay Now"
                                    }
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </main>

        </div>
    );
};

export default ClientInvoiceDetails;