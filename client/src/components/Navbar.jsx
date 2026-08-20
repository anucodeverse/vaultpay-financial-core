import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h2>VaultPay</h2>
            </div>

            <div className="navbar-right">
                <div className="user-info">
                    <strong>{user?.name}</strong>
                    <span>{user?.role}</span>
                </div>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;