import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import type { UserTrainingSummary } from "../../interfaces/UserTrainingSummary";
import { UserTrainingDetailsModal } from "../../components/UserTrainingDetailsModal/UserTrainingDetailsModal";
import { trainingNeedService } from "../../api/services/TrainingNeedService";
import { Table } from "../../components/Table/Table";
import { BiArrowBack, BiLoaderAlt, BiErrorCircle, BiDownload } from "react-icons/bi";
import Swal from "sweetalert2";

const columns = [
    {
        name: "Nombre del solicitante",
        selector: (row: UserTrainingSummary) => row.userName,
    },
    {
        name: "Cantidad de capacitaciones solicitadas",
        selector: (row: UserTrainingSummary) => row.totalNeeds
    }
];

export const IndexAdmin = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<UserTrainingSummary[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserTrainingSummary | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const navigate = useNavigate();

    const getTrainingNeedsByUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await trainingNeedService.getTrainingNeedsByUser();
            setUsers(data);
        } catch (error: any) {
            console.error("Error al hacer fetching", error);
            setError("No se pudieron cargar los datos. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTrainingNeedsByUser();
    }, []);

    const handleViewDetails = (user: UserTrainingSummary) => {
        setSelectedUser(user);
        setActionLoading(null)
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    const handleExportExcel = async () => {
        Swal.fire({
            title: "Generando archivo...",
            text: "Por favor espera mientras se prepara tu archivo excel",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await trainingNeedService.downloadExcel();
            Swal.close();

            await Swal.fire({
                icon: "success",
                title: "¡Descarga completada!",
                text: "El archivo excel se ha descargado correctamente",
                timer: 2500,
                showConfirmButton: false,
            });
        } catch (error: any) {
            Swal.close();
            await Swal.fire({
                icon: "error",
                title: "Error al descargar",
                text: error.message || "Ocurrio un problema al generar el archiv. Inténtalo de nuevo"
            });
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="py-24 flex flex-col items-center justify-center text-gray-500">
                    <BiLoaderAlt className="w-8 h-8 animate-spin mb-3" />
                    <p className="font-medium">Cargando datos...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="py-24 flex flex-col items-center justify-center text-center px-6">
                    <BiErrorCircle className="w-12 h-12 text-red-500 mb-3" />
                    <p className="font-medium text-red-600 mb-4">{error}</p>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={getTrainingNeedsByUser}
                    >
                        Reintentar
                    </Button>
                </div>
            );
        }

        if (users.length === 0) {
            return (
                <div className="py-24 text-center text-gray-400 italic">
                    No hay solicitudes de capacitación por usuario.
                </div>
            );
        }

        return (
            <>
                <div className="p-4 sm:p-5 flex justify-end border-b border-gray-200">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleExportExcel}
                        className="flex items-center justify-center gap-2"
                    >
                        <BiDownload className="w-4 h-4" />
                        <span>Descargar Excel</span>
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <Table<UserTrainingSummary>
                        columns={columns}
                        data={users}
                        onView={handleViewDetails}
                        actionLoading={actionLoading}
                    />
                </div>
            </>
        );
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100/50 p-4 md:p-6">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-6 md:mb-8 flex items-center gap-4">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="!p-2"
                        >
                            <BiArrowBack className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Panel de administración
                            </h1>
                            <p className="mt-1 text-sm md:text-base text-gray-600">
                                Revisa las solicitudes de capacitación de cada usuario.
                            </p>
                        </div>
                    </header>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {renderContent()}
                    </div>
                </div>
            </div>

            {selectedUser && (
                <UserTrainingDetailsModal
                    user={selectedUser}
                    isOpen={true}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};