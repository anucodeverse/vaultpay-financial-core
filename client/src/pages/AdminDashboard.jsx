import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-page">

            <Navbar />

            <main className="dashboard-container">

                <section className="dashboard-header">
                    <div>
                        <h1>Admin Dashboard</h1>

                        <p>
                            Welcome back, {user?.name}
                        </p>
                    </div>
                </section>

                <section className="dashboard-grid">

                    <div className="dashboard-card">
                        <h3>Invoice Management</h3>

                        <p>
                            Create and manage client invoices.
                        </p>

                        <Link 
    to="/admin/invoices"
    className="dashboard-button"
>
    View Invoices
</Link>
                    </div>

                    <div className="dashboard-card">
                        <h3>Financial Operations</h3>

                        <p>
                            Monitor invoice status and payment activity.
                        </p>

                        <span className="status-badge">
                            System Active
                        </span>
                    </div>

                    <div className="dashboard-card">
                        <h3>Security</h3>

                        <p>
                            Role-based access control is enabled.
                        </p>

                        <span className="status-badge">
                            Protected
                        </span>
                    </div>

                </section>

            </main>

        </div>
    );
};

export default AdminDashboard;