import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getInvoiceById } from "../services/invoiceService";
import "./AdminInvoiceDetails.css";

const AdminInvoiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                return "admin-detail-status admin-detail-status-paid";

            case "pending":
                return "admin-detail-status admin-detail-status-pending";

            case "failed":
                return "admin-detail-status admin-detail-status-failed";

            default:
                return "admin-detail-status";
        }
    };

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div className="dashboard-page">
                <Navbar />

                <main className="admin-invoice-details-container">
                    <div className="admin-invoice-details-loading">
                        Loading invoice details...
                    </div>
                </main>
            </div>
        );
    }

    // =========================================
    // ERROR
    // =========================================

    if (error) {
        return (
            <div className="dashboard-page">
                <Navbar />

                <main className="admin-invoice-details-container">

                    <button
                        className="admin-invoice-back-button"
                        onClick={() => navigate("/admin/invoices")}
                    >
                        ← Back to Invoices
                    </button>

                    <div className="admin-invoice-details-error">
                        <h2>Unable to Load Invoice</h2>

                        <p>{error}</p>

                        <button
                            className="admin-retry-button"
                            onClick={fetchInvoice}
                        >
                            Try Again
                        </button>
                    </div>

                </main>
            </div>
        );
    }

    // =========================================
    // INVOICE DETAILS
    // =========================================

    return (
        <div className="dashboard-page">

            <Navbar />

            <main className="admin-invoice-details-container">

                {/* =========================================
                    BACK BUTTON
                ========================================= */}

                <button
                    className="admin-invoice-back-button"
                    onClick={() => navigate("/admin/invoices")}
                >
                    ← Back to Invoices
                </button>


                {/* =========================================
                    PAGE HEADER
                ========================================= */}

                <div className="admin-invoice-details-header">

                    <div>
                        <h1>Invoice Details</h1>

                        <p>
                            View complete information about this invoice.
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
                    INVOICE CARD
                ========================================= */}

                <div className="admin-invoice-details-card">

                    {/* Invoice Header */}

                    <div className="admin-invoice-card-header">

                        <div>
                            <span className="admin-invoice-detail-label">
                                Invoice Number
                            </span>

                            <h2 className="admin-invoice-detail-number">
                                {invoice.invoiceNumber}
                            </h2>
                        </div>

                        <div className="admin-invoice-amount">

                            <span className="admin-invoice-detail-label">
                                Total Amount
                            </span>

                            <strong>
                                {formatAmount(
                                    invoice.amount,
                                    invoice.currency
                                )}
                            </strong>

                        </div>

                    </div>


                    {/* =========================================
                        CLIENT INFORMATION
                    ========================================= */}

                    <div className="admin-invoice-detail-section">

                        <h3>Client Information</h3>

                        <div className="admin-invoice-detail-grid">

                            <div className="admin-invoice-detail-item">

                                <span className="admin-invoice-detail-label">
                                    Client Name
                                </span>

                                <strong>
                                    {invoice.clientName || "-"}
                                </strong>

                            </div>


                            <div className="admin-invoice-detail-item">

                                <span className="admin-invoice-detail-label">
                                    Client Email
                                </span>

                                <strong>
                                    {invoice.clientEmail || "-"}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* =========================================
                        INVOICE INFORMATION
                    ========================================= */}

                    <div className="admin-invoice-detail-section">

                        <h3>Invoice Information</h3>

                        <div className="admin-invoice-detail-grid">

                            <div className="admin-invoice-detail-item">

                                <span className="admin-invoice-detail-label">
                                    Description
                                </span>

                                <strong>
                                    {invoice.description || "-"}
                                </strong>

                            </div>


                            <div className="admin-invoice-detail-item">

                                <span className="admin-invoice-detail-label">
                                    Due Date
                                </span>

                                <strong>
                                    {formatDate(invoice.dueDate)}
                                </strong>

                            </div>


                            <div className="admin-invoice-detail-item">

                                <span className="admin-invoice-detail-label">
                                    Currency
                                </span>

                                <strong>
                                    {invoice.currency?.toUpperCase() || "USD"}
                                </strong>

                            </div>


                            <div className="admin-invoice-detail-item">

                                <span className="admin-invoice-detail-label">
                                    Created Date
                                </span>

                                <strong>
                                    {formatDate(invoice.createdAt)}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* =========================================
                        PAYMENT INFORMATION
                    ========================================= */}

                    <div className="admin-invoice-detail-section">

                        <h3>Payment Information</h3>

                        <div className="admin-invoice-detail-grid">

                            <div className="admin-invoice-detail-item">

                                <span className="admin-invoice-detail-label">
                                    Payment Status
                                </span>

                                <span
                                    className={getStatusClass(
                                        invoice.status
                                    )}
                                >
                                    {invoice.status}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default AdminInvoiceDetails;