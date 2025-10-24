import type { TrainingNeedDetails } from "../../interfaces/TrainingNeedDetails";
import type { UserTrainingSummary } from "../../interfaces/UserTrainingSummary";
import { Button } from "../Button/Button";
import { Table } from "../Table/Table";
import { Avatar } from "../Avatar/Avatar";
import { BiX, BiPencil } from "react-icons/bi";
import { useState } from "react";
import { OffCanvas } from "../OffCanvas/OffCanvas";
import { FormTrainingNeeds } from "../FormTrainingNeeds/FormTrainingNeeds";

const PriorityBadge = ({ priority }: { priority: string }) => {
    let classes = "";
    switch (priority) {
        case "MUY URGENTE":
            classes = "bg-red-100 text-red-800 border-red-200";
            break;
        case "URGENTE":
            classes = "bg-yellow-100 text-yellow-800 border-yellow-200";
            break;
        case "POCO URGENTE":
            classes = "bg-green-100 text-green-800 border-green-200";
            break;
        default:
            classes = "bg-gray-100 text-gray-800 border-gray-200";
    }
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
            {priority}
        </span>
    );
};

const modalColumns = [
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
        cell: (row: TrainingNeedDetails) => <PriorityBadge priority={row.priorirty} />, // 👈 typo intencional (usa tu campo actual)
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
    {
        name: "Acciones",
        cell: (row: TrainingNeedDetails) => (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleEditFromColumn(row);
                }}
                className="p-2 text-orange-600 hover:bg-orange-100 rounded-md transition-colors"
                title="Editar"
                aria-label={`Editar necesidad ${row.id}`}
            >
                <BiPencil className="w-4 h-4" />
            </button>
        ),
        ignoreRowClick: true,
        width: "100px",
        center: true,
    },
];

interface Props {
    user: UserTrainingSummary | null;
    isOpen: boolean;
    onClose: () => void;
}

let handleEditFromColumn: (need: TrainingNeedDetails) => void = () => { };

export const UserTrainingDetailsModal = ({ user, isOpen, onClose }: Props) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);

    const handleEdit = (need: TrainingNeedDetails) => {
        setEditingId(need.id);
        setIsOffCanvasOpen(true);
    };

    handleEditFromColumn = handleEdit;

    const handleCloseOffCanvas = () => {
        setIsOffCanvasOpen(false);
        setEditingId(null);
    };

    const handleSuccess = () => {
        handleCloseOffCanvas();
    };

    if (!isOpen || !user) return null;

    return (
        <>
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            >
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                ></div>

                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    className={`relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 ease-out ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
                        }`}
                >
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <Avatar name={user.userName} />
                            <h2 id="modal-title" className="text-xl font-bold text-gray-800">
                                Capacitaciones de <span className="text-blue-600">{user.userName}</span>
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Cerrar modal"
                        >
                            <BiX className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="overflow-y-auto p-6 flex-1">
                        <dl className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Nómina</dt>
                                <dd className="mt-1 text-base font-semibold text-gray-900">{user.payRollNumber}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Total de Registros</dt>
                                <dd className="mt-1 text-base font-semibold text-gray-900">{user.totalNeeds}</dd>
                            </div>
                        </dl>

                        <h3 className="font-semibold text-lg mb-3 text-gray-700">
                            Lista de necesidades
                        </h3>

                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <Table
                                columns={modalColumns}
                                data={user.trainingNeeds}
                                loading={false}
                                pagination={user.trainingNeeds.length > 5}
                                title=""
                            />
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-200 flex justify-end flex-shrink-0 bg-gray-50">
                        <Button onClick={onClose} variant="secondary" size="sm">
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>

            <OffCanvas
                title="Editar necesidad"
                isOpen={isOffCanvasOpen}
                onClose={handleCloseOffCanvas}
            >
                {editingId !== null && (
                    <FormTrainingNeeds
                        trainingNeedId={editingId}
                        onSuccess={handleSuccess}
                    />
                )}
            </OffCanvas>
        </>
    );
};