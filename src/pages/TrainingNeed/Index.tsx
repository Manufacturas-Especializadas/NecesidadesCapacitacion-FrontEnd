import { useState } from "react";
import { Button } from "../../components/Button/Button";
import { OffCanvas } from "../../components/OffCanvas/OffCanvas";
import { FormTrainingNeeds } from "../../components/FormTrainingNeeds/FormTrainingNeeds";
import { BiPlus } from "react-icons/bi";
import { TrainingNeedsTable } from "../../components/TrainingNeedsTable/TrainingNeedsTable";

export const Index = () => {
    const [isOffCanvasOpen, setIsOffCanvas] = useState(false);
    const [tableKey, setTableKey] = useState(0);

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