import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="payment-result-page">

            <Navbar />

            <main className="payment-result-container">

                <div className="payment-result-card">

                    <div className="payment-success-icon">
                        ✓
                    </div>

                    <h1>
                        Payment Successful
                    </h1>

                    <p>
                        Your payment has been received successfully.
                    </p>

                    <p className="payment-result-note">
                        Your invoice status will be updated after
                        Stripe confirms the payment through the
                        secure webhook.
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

export default PaymentSuccess;