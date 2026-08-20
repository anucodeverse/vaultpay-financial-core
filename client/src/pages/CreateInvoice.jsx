import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createInvoice } from "../services/invoiceService";

const CreateInvoice = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
    clientId: "",
    description: "",
    amount: "",
    currency: "usd",
    dueDate: ""
});

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
       const invoiceData = {
    clientId: formData.clientId,
    description: formData.description,
    amount: Number(formData.amount),
    currency: formData.currency,
    dueDate: formData.dueDate
};

        console.log("Invoice data being sent:", invoiceData);

        const data = await createInvoice(invoiceData);

        setSuccess(
            `Invoice ${data.invoice.invoiceNumber} created successfully.`
        );

        setFormData({
            clientId: "",
            description: "",
            amount: "",
            currency: "usd",
            dueDate: ""
        });

    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Failed to create invoice."
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="dashboard-page">

            <Navbar />

            <main className="form-container">

                <div className="form-header">
                    <h1>Create Invoice</h1>

                    <p>
                        Create a new invoice for a client.
                    </p>
                </div>

                <form
                    className="invoice-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">
                        <label>Client ID</label>

                        <input
                            type="text"
                            name="clientId"
                            value={formData.clientId}
                            onChange={handleChange}
                            placeholder="Enter client ID"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Service description"
                            required
                        />
                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Amount</label>

                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="1000"
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Currency</label>

                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                            >
                                <option value="usd">
                                    USD
                                </option>

                                <option value="eur">
                                    EUR
                                </option>

                                <option value="gbp">
                                    GBP
                                </option>
                            </select>
                        </div>

                    </div>

                    <div className="form-group">
                        <label>Due Date</label>

                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    <div className="form-actions">

                        <button
                            type="button"
                            onClick={() => navigate("/admin")}
                            className="secondary-button"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="primary-button"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Invoice"}
                        </button>

                    </div>

                </form>

            </main>

        </div>
    );
};

export default CreateInvoice;