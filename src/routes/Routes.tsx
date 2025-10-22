import { Route, Routes } from "react-router-dom";
import { Index } from "../pages/TrainingNeed/Index";
import { IndexAdmin } from "../pages/Admin/Index";
import { Login } from "../pages/Auth/Login";
import { Register } from "../pages/Auth/Register";
import { PublicRoute } from "../components/PublicRoute/PublicRoute";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";

export const MyRoutes = () => {
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

                <Route element={<ProtectedRoute />}>

                    {/* Admin */}
                    <Route path="/administrador" element={<IndexAdmin />} />

                    {/* Auth */}
                    <Route path="/register" element={<Register />} />

                    {/* Training Needs */}
                    <Route path="/" element={<Index />} />
                </Route>
            </Routes>
        </>
    )
}
