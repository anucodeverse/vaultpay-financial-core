import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAllInvoices } from "../services/invoiceService";
import "./AdminInvoices.css";

const AdminInvoices = () => {
    const navigate = useNavigate();

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllInvoices();

            setInvoices(data.invoices || []);
        } catch (error) {
            console.error(
                "Failed to fetch invoices:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to load invoices."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================
    // SUMMARY STATISTICS
    // =========================================

    const totalInvoices = invoices.length;

    const pendingInvoices = invoices.filter(
        (invoice) => invoice.status === "pending"
    ).length;

    const paidInvoices = invoices.filter(
        (invoice) => invoice.status === "paid"
    ).length;

    const failedInvoices = invoices.filter(
        (invoice) => invoice.status === "failed"
    ).length;

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
                return "admin-status-badge admin-status-paid";

            case "pending":
                return "admin-status-badge admin-status-pending";

            case "failed":
                return "admin-status-badge admin-status-failed";

            default:
                return "admin-status-badge";
        }
    };
        return (
        <div className="dashboard-page">

            <Navbar />

            <main className="admin-invoices-container">

                {/* =========================================
                    PAGE HEADER
                ========================================= */}

                <div className="admin-invoices-header">

                    <div>
                        <h1>Invoices</h1>

                        <p>
                            Manage and monitor all client invoices.
                        </p>
                    </div>

                    <button
                        className="admin-create-invoice-button"
                        onClick={() =>
                            navigate("/admin/invoices/create")
                        }
                    >
                        + Create Invoice
                    </button>

                </div>


                {/* =========================================
                    SUMMARY CARDS
                ========================================= */}

                <div className="admin-invoices-summary-grid">

                    {/* Total */}

                    <div className="admin-invoices-summary-card">

                        <div className="admin-summary-content">

                            <span className="admin-summary-label">
                                Total Invoices
                            </span>

                            <strong className="admin-summary-value">
                                {totalInvoices}
                            </strong>

                        </div>

                    </div>


                    {/* Pending */}

                    <div className="admin-invoices-summary-card">

                        <div className="admin-summary-content">

                            <span className="admin-summary-label">
                                Pending
                            </span>

                            <strong className="admin-summary-value">
                                {pendingInvoices}
                            </strong>

                        </div>

                    </div>


                    {/* Paid */}

                    <div className="admin-invoices-summary-card">

                        <div className="admin-summary-content">

                            <span className="admin-summary-label">
                                Paid
                            </span>

                            <strong className="admin-summary-value">
                                {paidInvoices}
                            </strong>

                        </div>

                    </div>

                </div>
                                {/* =========================================
                    LOADING
                ========================================= */}

                {loading && (
                    <div className="admin-invoices-loading">
                        Loading invoices...
                    </div>
                )}


                {/* =========================================
                    ERROR
                ========================================= */}

                {!loading && error && (

                    <div className="admin-invoices-error">

                        <span>
                            {error}
                        </span>

                        <button
                            className="admin-retry-button"
                            onClick={fetchInvoices}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* =========================================
                    INVOICE SECTION
                ========================================= */}

                {!loading && !error && (

                    <div className="admin-invoices-section">

                        <div className="admin-invoices-section-header">

                            <div>

                                <h2>
                                    All Invoices
                                </h2>

                                <p>
                                    {totalInvoices} invoice
                                    {totalInvoices !== 1
                                        ? "s"
                                        : ""}
                                </p>

                            </div>

                        </div>
                                                {/* =========================================
                            EMPTY STATE
                        ========================================= */}

                        {invoices.length === 0 ? (

                            <div className="admin-invoices-empty">

                                <h3>
                                    No invoices found
                                </h3>

                                <p>
                                    Create your first invoice
                                    to get started.
                                </p>

                                <button
                                    className="admin-empty-create-button"
                                    onClick={() =>
                                        navigate(
                                            "/admin/invoices/create"
                                        )
                                    }
                                >
                                    Create Invoice
                                </button>

                            </div>

                        ) : (

                            /* =========================================
                               INVOICE TABLE
                            ========================================= */

                            <div className="admin-invoices-table-container">

                                <table className="admin-invoices-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Invoice
                                            </th>

                                            <th>
                                                Client
                                            </th>

                                            <th>
                                                Description
                                            </th>

                                            <th>
                                                Amount
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Due Date
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {invoices.map(
                                            (invoice) => (

                                                <tr
                                                    key={
                                                        invoice._id
                                                    }
                                                >

                                                    {/* Invoice Number */}

                                                    <td>

                                                        <strong className="admin-invoice-number">
                                                            {
                                                                invoice.invoiceNumber
                                                            }
                                                        </strong>

                                                    </td>


                                                    {/* Client */}

                                                    <td>

                                                        <div className="admin-client-info">

                                                            <strong className="admin-client-name">
                                                                {
                                                                    invoice.clientName
                                                                }
                                                            </strong>

                                                            <span className="admin-client-email">
                                                                {
                                                                    invoice.clientEmail
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* Description */}

                                                    <td>
                                                        {
                                                            invoice.description
                                                        }
                                                    </td>


                                                    {/* Amount */}

                                                    <td>

                                                        <strong>
                                                            {
                                                                formatAmount(
                                                                    invoice.amount,
                                                                    invoice.currency
                                                                )
                                                            }
                                                        </strong>

                                                    </td>


                                                    {/* Status */}

                                                    <td>

                                                        <span
                                                            className={getStatusClass(
                                                                invoice.status
                                                            )}
                                                        >
                                                            {
                                                                invoice.status
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* Due Date */}

                                                    <td>

                                                        {
                                                            formatDate(
                                                                invoice.dueDate
                                                            )
                                                        }

                                                    </td>


                                                    {/* Action */}

                                                    <td>

                                                        <button
                                                            className="admin-view-button"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/invoices/${invoice._id}`
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                )}

            </main>

        </div>
    );
};

export default AdminInvoices;