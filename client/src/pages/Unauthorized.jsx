import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Unauthorized = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGoBack = () => {
        if (user?.role === "admin") {
            navigate("/admin");
        } else if (user?.role === "client") {
            navigate("/client");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="unauthorized-page">

            <div className="unauthorized-card">

                <h1>403</h1>

                <h2>Access Denied</h2>

                <p>
                    You do not have permission to access this page.
                </p>

                <button onClick={handleGoBack}>
                    Go Back
                </button>

            </div>

        </div>
    );
};

export default Unauthorized;