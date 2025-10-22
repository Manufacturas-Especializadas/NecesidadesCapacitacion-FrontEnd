import { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import type { UserTrainingSummary } from "../../interfaces/UserTrainingSummary";
import { UserTrainingDetailsModal } from "../../components/UserTrainingDetailsModal/UserTrainingDetailsModal";
import { trainingNeedService } from "../../api/services/TrainingNeedService";
import { Table } from "../../components/Table/Table";

export const IndexAdmin = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState<UserTrainingSummary[]>([]);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserTrainingSummary | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const getTrainingNeedsByUser = async () => {
            try {
                const data = await trainingNeedService.getTrainingNeedsByUser();
                setUsers(data);
                setError(null);
            } catch (error: any) {
                console.error("Error al hacer fetching");
            } finally {
                setLoading(false);
            }
        };

        getTrainingNeedsByUser();
    }, []);

    const handleViewDetails = (user: UserTrainingSummary) => {
        setSelectedUser(user);
        setShowDetails(true);
        setActionLoading(null);
    };

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

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Panel de administración
                        </h1>
                        <p className="mt-1 text-sm md:text-base text-gray-600">
                            Gestiona los recursos de tu plataforma
                        </p>
                    </header>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 md:p-6">
                            {
                                loading ? (
                                    <div className="py-12 text-center text-gray-500">
                                        Cargando datos...
                                    </div>
                                ) : error ? (
                                    <div className="py-12 text-center">
                                        <div className="text-red-500 font-medium mb-2">
                                            {error}
                                        </div>
                                        <Button variant="primary" size="sm">
                                            Reintentar
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Table<UserTrainingSummary>
                                            columns={columns}
                                            data={users}
                                            onView={handleViewDetails}
                                            actionLoading={actionLoading}
                                        />
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            {
                selectedUser && (
                    <UserTrainingDetailsModal
                        user={selectedUser}
                        isOpen={showDetails}
                        onClose={() => {
                            setShowDetails(false);
                            setSelectedUser(null)
                        }}
                    />
                )
            }
        </>
    )
}