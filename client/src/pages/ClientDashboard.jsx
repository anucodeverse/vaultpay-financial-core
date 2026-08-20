import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { getMyInvoices } from "../services/invoiceService";
import "./ClientDashboard.css";

const ClientDashboard = () => {
    const { user, logout } = useAuth();
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

            const data = await getMyInvoices();

            setInvoices(data.invoices || []);
        } catch (error) {
            console.error(
                "Failed to fetch invoices:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to load your invoices."
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

    // =========================================
    // TOTAL AMOUNT
    // =========================================

    const totalAmount = invoices.reduce(
        (total, invoice) => total + Number(invoice.amount || 0),
        0
    );

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
                return "client-status-badge client-status-paid";

            case "pending":
                return "client-status-badge client-status-pending";

            case "failed":
                return "client-status-badge client-status-failed";

            default:
                return "client-status-badge";
        }
    };

    return (
        <div className="client-dashboard-page">

            <Navbar />

            <main className="client-dashboard-container">

                {/* =========================================
                    WELCOME SECTION
                ========================================= */}

                <section className="client-welcome-section">

                    <div>
                        <p className="client-welcome-label">
                            Client Portal
                        </p>

                        <h1>
                            Welcome back, {user?.name || "Client"} 👋
                        </h1>

                        <p className="client-welcome-description">
                            Manage your invoices and payments from one place.
                        </p>
                    </div>

                    <button
                        className="client-logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </section>


                {/* =========================================
                    SUMMARY CARDS
                ========================================= */}

                <section className="client-summary-grid">

                    <div className="client-summary-card">

                        <div className="client-summary-content">

                            <span className="client-summary-label">
                                Total Invoices
                            </span>

                            <strong className="client-summary-value">
                                {totalInvoices}
                            </strong>

                        </div>

                    </div>


                    <div className="client-summary-card">

                        <div className="client-summary-content">

                            <span className="client-summary-label">
                                Pending
                            </span>

                            <strong className="client-summary-value">
                                {pendingInvoices}
                            </strong>

                        </div>

                    </div>


                    <div className="client-summary-card">

                        <div className="client-summary-content">

                            <span className="client-summary-label">
                                Paid
                            </span>

                            <strong className="client-summary-value">
                                {paidInvoices}
                            </strong>

                        </div>

                    </div>


                    <div className="client-summary-card">

                        <div className="client-summary-content">

                            <span className="client-summary-label">
                                Total Value
                            </span>

                            <strong className="client-summary-value">
                                {formatAmount(totalAmount, "USD")}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    INVOICES SECTION
                ========================================= */}

                <section className="client-invoices-section">

                    <div className="client-invoices-section-header">

                        <div>
                            <h2>My Invoices</h2>

                            <p>
                                View and manage your invoices.
                            </p>
                        </div>

                    </div>


                    {/* =========================================
                        LOADING
                    ========================================= */}

                    {loading && (
                        <div className="client-invoices-loading">
                            Loading your invoices...
                        </div>
                    )}


                    {/* =========================================
                        ERROR
                    ========================================= */}

                    {!loading && error && (

                        <div className="client-invoices-error">

                            <div>
                                <strong>
                                    Unable to load invoices
                                </strong>

                                <p>
                                    {error}
                                </p>
                            </div>

                            <button
                                className="client-retry-button"
                                onClick={fetchInvoices}
                            >
                                Try Again
                            </button>

                        </div>

                    )}


                    {/* =========================================
                        EMPTY STATE
                    ========================================= */}

                    {!loading &&
                        !error &&
                        invoices.length === 0 && (

                            <div className="client-invoices-empty">

                                <h3>
                                    No invoices found
                                </h3>

                                <p>
                                    You don't have any invoices yet.
                                </p>

                            </div>
                        )
                    }


                    {/* =========================================
                        INVOICE TABLE
                    ========================================= */}

                    {!loading &&
                        !error &&
                        invoices.length > 0 && (

                            <div className="client-invoices-table-container">

                                <table className="client-invoices-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Invoice
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
                                                    key={invoice._id}
                                                >

                                                    <td>
                                                        <strong className="client-invoice-number">
                                                            {invoice.invoiceNumber}
                                                        </strong>
                                                    </td>


                                                    <td>
                                                        <span className="client-invoice-description">
                                                            {invoice.description}
                                                        </span>
                                                    </td>


                                                    <td>
                                                        <strong>
                                                            {formatAmount(
                                                                invoice.amount,
                                                                invoice.currency
                                                            )}
                                                        </strong>
                                                    </td>


                                                    <td>

                                                        <span
                                                            className={getStatusClass(
                                                                invoice.status
                                                            )}
                                                        >
                                                            {invoice.status}
                                                        </span>

                                                    </td>


                                                    <td>
                                                        {formatDate(
                                                            invoice.dueDate
                                                        )}
                                                    </td>


                                                    <td>

                                                        <button
                                                            className="client-view-button"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/client/invoices/${invoice._id}`
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

                        )
                    }

                </section>

            </main>

        </div>
    );
};

export default ClientDashboard;