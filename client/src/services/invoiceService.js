import axios from "axios";

const API_URL = "http://localhost:5000/api/invoices";

const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const createInvoice = async (invoiceData) => {
    try {
        console.log("Invoice data being sent:", invoiceData);

        const response = await axios.post(
            API_URL,
            invoiceData,
            getAuthConfig()
        );

        return response.data;

    } catch (error) {
        console.error(
            "Create invoice failed:",
            error.response?.data || error.message
        );

        throw error;
    }
};

export const getMyInvoices = async () => {
    const response = await axios.get(
        `${API_URL}/my`,
        getAuthConfig()
    );

    return response.data;
};

export const getAllInvoices = async () => {
    const response = await axios.get(
        API_URL,
        getAuthConfig()
    );

    return response.data;
};

export const getInvoiceById = async (invoiceId) => {
    const response = await axios.get(
        `${API_URL}/${invoiceId}`,
        getAuthConfig()
    );

    return response.data;
};

export const createCheckoutSession = async (invoiceId) => {
    const response = await axios.post(
        `${API_URL}/${invoiceId}/checkout`,
        {},
        getAuthConfig()
    );

    return response.data;
};