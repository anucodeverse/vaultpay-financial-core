import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
});

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/register`,
    formData
);

            setMessage(
                response.data.message || "Registration successful"
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="register-container">

            <div className="register-card">

                <div className="register-brand">
                    <h1>VaultPay</h1>
                    <p>Secure Financial Management</p>
                </div>

                <h2>Create Account</h2>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    <div>
                        <label>Full Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Email Address</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <button
                        type="submit"
                        className="register-button"
                    >
                        Create Account
                    </button>

                </form>

                {message && (
                    <div className="register-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="register-error">
                        {error}
                    </div>
                )}

                <div className="register-login">
                    Already have an account?

                    <button
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </div>

            </div>

        </div>
    );
};

export default Register;