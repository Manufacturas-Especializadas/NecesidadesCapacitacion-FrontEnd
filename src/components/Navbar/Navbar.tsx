import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logomesa.png";
import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt } from "react-icons/fa";


export const Navbar = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return null;
    };

    if (!user) {
        return null;
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                await fetch("/api/Auth/Logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                });
            }
        } catch (error: any) {
            console.error("Error al cerrar sesión", error);
        } finally {
            logout();
            navigate("/login");
        }
    };
    return (
        <>
            <nav className="bg-primary shadow-lg shadow-gray-300 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <img
                                src={Logo}
                                alt="logo"
                                className="h-10 w-auto rounded-md shadow-sm border border-primary/20"
                            />
                            <Link to="/">
                                <h1 className="text-white text-xl font-bold tracking-tight uppercase">
                                    Necesidades de capacitación
                                </h1>
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center space-x-6">
                            <div className="flex items-center space-x-3">
                                <span className="text-white font-medium hidden sm:inline">
                                    Hola, {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-white hover:text-red-300 transition-colors
                                        hover:cursor-pointer"
                                    aria-label="Cerrar sesión"
                                >
                                    <FaSignOutAlt className="text-sm" />
                                    <span className="ml-1 hidden sm:inline">Salir</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
