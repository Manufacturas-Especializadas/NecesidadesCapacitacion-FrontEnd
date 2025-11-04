import { useState } from "react";
import { Button } from "../../components/Button/Button";
import { OffCanvas } from "../../components/OffCanvas/OffCanvas";
import { FormTrainingNeeds } from "../../components/FormTrainingNeeds/FormTrainingNeeds";
import { BiCog, BiPlus } from "react-icons/bi";
import { TrainingNeedsTable } from "../../components/TrainingNeedsTable/TrainingNeedsTable";
import { useNavigate } from "react-router-dom";
import { RoleGuard } from "../../components/RoleGuard/RoleGuard";
import fraseCapacitacion from "../../assets/Nelsonmandela.png";

export const Index = () => {
    const [isOffCanvasOpen, setIsOffCanvas] = useState(false);
    const [tableKey, setTableKey] = useState(0);
    const navigate = useNavigate();

    const handleOpenOffCanvas = () => setIsOffCanvas(true);
    const handleCloseOffCanvas = () => setIsOffCanvas(false);

    const handleSuccess = () => {
        handleCloseOffCanvas();
        setTableKey(prev => prev + 1);
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="w-full border-t border-gray-200 mb-4">
                        <img
                            src={fraseCapacitacion}
                            alt="La educación es el arma más poderosa que puedes usar para cambiar al mundo - Nelson Mandela"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                    <div className="mb-8 p-5 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col
                        md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Plan de capacitación
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Gestiona y visualiza las necesidades de capacitación del equipo
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <RoleGuard allowedRoles={["Admin"]}>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="flex items-center justify-center gap-2"
                                    onClick={() => navigate("/administrador")}
                                >
                                    <BiCog />
                                    <span>Administrador</span>
                                </Button>
                            </RoleGuard>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleOpenOffCanvas}
                                className="flex items-center justify-center gap-2"
                            >
                                <BiPlus />
                                <span>Nueva necesidad</span>
                            </Button>
                        </div>
                    </div>


                    <div className="w-full">
                        <TrainingNeedsTable reloadTrigger={tableKey} />
                    </div>
                </div>
                <OffCanvas
                    title="Nueva necesidad de capacitación"
                    isOpen={isOffCanvasOpen}
                    onClose={handleCloseOffCanvas}
                >
                    <FormTrainingNeeds onSuccess={handleSuccess} />
                </OffCanvas>
            </div>
        </>
    );
};