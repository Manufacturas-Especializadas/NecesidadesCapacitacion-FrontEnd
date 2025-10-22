import { useState } from "react";
import { Button } from "../../components/Button/Button";
import { TrainingNeedsTable } from "../../components/TrainingNeedsTable/TrainingNeedsTable";
import { OffCanvas } from "../../components/OffCanvas/OffCanvas";
import { FormTrainingNeeds } from "../../components/FormTrainingNeeds/FormTrainingNeeds";

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
            <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Planificación de necesidades de capacitación
                        </h1>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleOpenOffCanvas}
                    >
                        + Nueva necesidad
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                    <TrainingNeedsTable reloadTrigger={tableKey} />
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
    )
}