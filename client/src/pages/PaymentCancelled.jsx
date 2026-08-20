import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./PaymentSuccess.css";
import "./PaymentCancelled.css";
const PaymentCancelled = () => {
    const navigate = useNavigate();

    return (
        <div className="payment-result-page">

            <Navbar />

            <main className="payment-result-container">

                <div className="payment-result-card">

                    <div className="payment-cancel-icon">
                        ×
                    </div>

                    <h1>
                        Payment Cancelled
                    </h1>

                    <p>
                        Your payment was cancelled and no
                        payment was completed.
                    </p>

                    <p className="payment-result-note">
                        Your invoice remains unchanged.
                    </p>

                    <button
                        className="payment-result-button"
                        onClick={() => navigate("/client")}
                    >
                        Back to Dashboard
                    </button>

                </div>

            </main>

        </div>
    );
};

export default PaymentCancelled;