import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface User {
    id: string;
    name: string;
    role: string;
    payRollNumber?: string
};

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUser({
                    id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                    name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                    role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                    payRollNumber: payload['PayRollNumber']
                });
            } catch (error: any) {
                console.error("Token invalido", error);
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        const payload = JSON.parse(atob(token.split(".")[1]));

        const newUser = {
            id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
            name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        };

        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro del AuthProvider");
    }

    return context;
};