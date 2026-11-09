import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Index } from "../pages/TrainingNeed/Index";
import { IndexAdmin } from "../pages/Admin/Index";
import { Login } from "../pages/Auth/Login";
import { Register } from "../pages/Auth/Register";
import { PublicRoute } from "../components/PublicRoute/PublicRoute";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";

export const MyRoutes = () => {
    const { user, loading } = useAuth();
    return (
        <>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                >
                </Route>

                <Route path="/register" element={loading ? null : user?.role === "Admin" ? <Register /> : <Navigate to="/" replace />} />

                <Route element={<ProtectedRoute />}>

                    {/* Admin */}
                    <Route path="/administrador" element={<IndexAdmin />} />

                    {/* Training Needs */}
                    <Route path="/" element={<Index />} />
                </Route>
            </Routes>
        </>
    )
}
