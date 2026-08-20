import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import CreateInvoice from "./pages/CreateInvoice";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import AdminInvoices from "./pages/AdminInvoices";
import AdminInvoiceDetails from "./pages/AdminInvoiceDetails";
import Unauthorized from "./pages/Unauthorized";
import ClientInvoiceDetails from "./pages/ClientInvoiceDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import Register from "./pages/Register";
function App() {
    return (
        <Routes>

            {/* ================================
                PUBLIC ROUTES
            ================================= */}

            <Route
                path="/login"
                element={<Login />}
            />
            <Route
    path="/register"
    element={<Register />}
/>
            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />


            {/* ================================
                PROTECTED ROUTES
            ================================= */}

            <Route element={<ProtectedRoute />}>

                {/* ============================
                    ADMIN ROUTES
                ============================= */}

                <Route element={<RoleRoute allowedRole="admin" />}>

                    <Route
                        path="/admin"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin/invoices"
                        element={<AdminInvoices />}
                    />

                    <Route
                        path="/admin/invoices/create"
                        element={<CreateInvoice />}
                    />

                    <Route
                        path="/admin/invoices/:id"
                        element={<AdminInvoiceDetails />}
                    />

                </Route>


                {/* ============================
                    CLIENT ROUTES
                ============================= */}

                <Route element={<RoleRoute allowedRole="client" />}>

                    <Route
                        path="/client"
                        element={<ClientDashboard />}
                    />

                </Route>

                <Route
    path="/client/invoices/:id"
    element={<ClientInvoiceDetails />}
/>

            </Route>
            <Route
    path="/payment-success"
    element={<PaymentSuccess />}
/>

<Route
    path="/payment-cancelled"
    element={<PaymentCancelled />}
/>
         

            


            {/* ================================
                DEFAULT ROUTE
            ================================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>
    );
}

export default App;