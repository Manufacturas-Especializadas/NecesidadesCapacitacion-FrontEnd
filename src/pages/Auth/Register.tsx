import { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import type { Roles } from "../../interfaces/Roles";
import { useNavigate } from "react-router";
import { authService } from "../../api/services/AuthService";
import Logo from "../../assets/logomesa.png";
import Swal from "sweetalert2";
import { FormInput } from "../../components/FormInput/FormInput";

interface RegisterForm {
    name: string;
    payRollNumber: number;
    password: string;
    roleName: string;
}

export const Register = () => {
    const [formData, setFormData] = useState<RegisterForm>({
        name: "",
        payRollNumber: 0,
        password: "",
        roleName: "",
    });

    const [roles, setRoles] = useState<Roles[]>([]);
    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const data = await authService.getRoles();
                setRoles(data);
            } catch (error: any) {
                console.error("Error al cargar roles", error);
            }
        };
        loadRoles();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        if (!formData.name.trim() || formData.payRollNumber <= 0 || !formData.password || !formData.roleName) {
            setError("Por favor, completa todos los campos correctamente.");
            setIsSubmitting(false);
            return;
        }

        try {
            await authService.register(
                formData.name,
                formData.payRollNumber,
                formData.password,
                formData.roleName
            );

            Swal.fire({
                title: "¡Éxito!",
                text: "Usuario registrado exitosamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            });

            navigate("/");
        } catch (err: any) {
            console.error("Error en registro:", err);
            const errorMessage = err?.response?.data?.message || err.message || "Error al registrar usuario. Inténtalo de nuevo.";
            setError(errorMessage);

            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const rolesOptions = roles.map(role => ({
        value: role.name,
        label: role.name
    }));

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                    <div className="flex justify-center mb-8">
                        <img src={Logo} alt="MESA" className="h-20 w-auto" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 uppercase">
                        Registrar usuario
                    </h2>

                    {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <FormInput
                                type="text"
                                label="Nombre"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <FormInput
                                type="number"
                                label="Número de nómina"
                                name="payRollNumber"
                                value={formData.payRollNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <FormInput
                                type="password"
                                label="Contraseña"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <FormInput
                            type="select"
                            label="Rol"
                            name="roleName"
                            options={rolesOptions}
                            onChange={handleChange}
                            required
                        />
                        <div className="flex justify-center gap-2">
                            <Button
                                type="submit"
                                variant="secondary"
                                size="sm"
                                disabled={isSubmitting}
                            >
                                REGISTRAR
                            </Button>
                            <Button
                                type="button"
                                variant="cancel"
                                size="sm"
                                onClick={() => navigate("/")}
                                disabled={isSubmitting}
                            >
                                CANCELAR
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};