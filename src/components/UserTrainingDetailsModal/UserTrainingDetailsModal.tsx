import type { TrainingNeedDetails } from "../../interfaces/TrainingNeedDetails";
import type { UserTrainingSummary } from "../../interfaces/UserTrainingSummary"
import { Button } from "../Button/Button";
import { Table } from "../Table/Table";

interface Props {
    user: UserTrainingSummary;
    isOpen: boolean;
    onClose: () => void;
};

export const UserTrainingDetailsModal = ({ user, isOpen, onClose }: Props) => {
    if (!isOpen) return null;

    return (
        <>
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div
                    className={`relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 ease-out ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
                        }`}
                >
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">
                            Capacitaciones solicitadas de <span className="text-blue-600">{user.userName}</span>
                        </h2>
                        <Button variant="secondary" size="sm" onClick={onClose}>
                            &times;
                        </Button>
                    </div>

                    <div className="overflow-y-auto p-6 flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-3 mb-6 text-sm">
                            <div><strong>Nómina: </strong>{user.payRollNumber}</div>
                            <div><strong>Total de registros: </strong>{user.totalNeeds}</div>
                        </div>

                        <h3 className="font-semibold text-lg mb-3 text-gray-700">
                            Lista de necesidades de capacitación
                        </h3>

                        <Table
                            columns={[
                                {
                                    name: "Necesidad actual",
                                    selector: (row: TrainingNeedDetails) => row.presentNeed,
                                    wrap: true,
                                },
                                {
                                    name: "Curso sugerido",
                                    selector: (row: TrainingNeedDetails) => row.suggestedTrainingCourse,
                                    wrap: true,
                                },
                                {
                                    name: "Prioridad",
                                    selector: (row: TrainingNeedDetails) => row.priorirty,
                                    conditionalCellStyles: [
                                        {
                                            when: (row: TrainingNeedDetails) => row.priorirty === "MUY URGENTE",
                                            style: { color: "#e53e3e", fontWeight: "bold" },
                                        },
                                        {
                                            when: (row: TrainingNeedDetails) => row.priorirty === "URGENTE",
                                            style: { color: "#dd6b20" },
                                        },
                                        {
                                            when: (row: TrainingNeedDetails) => row.priorirty === "POCO URGENTE",
                                            style: { color: "#38a169" },
                                        },
                                    ],
                                },
                                {
                                    name: "Fecha",
                                    selector: (row: TrainingNeedDetails) =>
                                        new Date(row.registrationDate).toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        }),
                                    width: "180px",
                                },
                            ]}
                            data={user.trainingNeeds}
                            loading={false}
                            pagination={user.trainingNeeds.length > 5}
                            title=""
                        />
                    </div>

                    <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                        <Button onClick={onClose} variant="secondary" size="sm">
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
