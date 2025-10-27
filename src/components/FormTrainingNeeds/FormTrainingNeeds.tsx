import { useEffect, useState } from "react";
import { FormInput } from "../FormInput/FormInput";
import { Button } from "../Button/Button";
import type { Prioritys } from "../../interfaces/Prioritys";
import { trainingNeedService, type TrainingNeedFormData } from "../../api/services/TrainingNeedService";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Category } from "../../interfaces/Category";
import type { Status } from "../../interfaces/Status";

interface Props {
    onSuccess?: () => void;
    trainingNeedId?: number;
};

export const FormTrainingNeeds = ({ onSuccess, trainingNeedId }: Props) => {
    const { user, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState<TrainingNeedFormData>({
        presentNeed: '',
        positionsOrCollaborator: '',
        suggestedTrainingCourse: '',
        qualityObjective: '',
        currentPerformance: '',
        expectedPerformance: '',
        providerUser: '',
        providerAdmin1: '',
        providerAdmin2: '',
        registrationDate: new Date().toISOString().split('T')[0],
        priorityId: 1,
        categoryId: 0,
        statusId: 3
    });
    const [priority, setPriority] = useState<Prioritys[]>([]);
    const [category, setCategory] = useState<Category[]>([]);
    const [status, setStatus] = useState<Status[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (trainingNeedId) {
            const loadTrainingNeed = async () => {
                try {
                    const data = await trainingNeedService.getTrainingNeedsById(trainingNeedId);
                    setFormData({
                        presentNeed: data?.presentNeed || '',
                        positionsOrCollaborator: data?.positionsOrCollaborator || '',
                        suggestedTrainingCourse: data?.suggestedTrainingCourse || '',
                        qualityObjective: data?.qualityObjective || '',
                        currentPerformance: data?.currentPerformance || '',
                        expectedPerformance: data?.expectedPerformance || '',
                        providerUser: data?.providerUser || '',
                        providerAdmin1: data?.providerAdmin1 || '',
                        providerAdmin2: data?.providerAdmin2 || '',
                        registrationDate: data?.registrationDate
                            ? new Date(data.registrationDate).toISOString().split('T')[0]
                            : new Date().toISOString().split('T')[0],
                        priorityId: data?.priorityId || 1,
                        categoryId: data?.categoryId || 0,
                        statusId: data?.statusId || 0
                    });
                } catch (error: any) {
                    console.error("Error al cargar la necesidad de capacitación", error);
                    Swal.fire("Error", "No se pudo cargar el registro", "error");
                }
            };
            loadTrainingNeed();
        }
    }, [trainingNeedId]);

    useEffect(() => {
        const loadPriority = async () => {
            try {
                const data = await trainingNeedService.getPriority();
                setPriority(data);
            } catch (error: any) {
                console.error("Error al cargar las prioridades");
            }
        };
        loadPriority();
    }, []);

    useEffect(() => {
        const loadCategory = async () => {
            try {
                const data = await trainingNeedService.getCategory()
                setCategory(data);
            } catch (error: any) {
                console.error("Error al cargar las categorias");
            }
        };
        loadCategory();
    }, []);

    useEffect(() => {
        const loadStatus = async () => {
            try {
                const data = await trainingNeedService.getStatus();
                setStatus(data);
            } catch (error: any) {
                console.error();
            }
        }
        loadStatus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // if (!isAuthenticated || !user) {
        //     Swal.fire({
        //         title: "Sesión expirada",
        //         text: "Por favor, inicia sesión nuevamente",
        //         icon: "warning",
        //         confirmButtonText: "Ir a login"
        //     }).then(() => {
        //         navigate("/login");
        //     });
        //     return;
        // }

        if (
            !formData.currentPerformance ||
            !formData.expectedPerformance ||
            !formData.presentNeed ||
            !formData.qualityObjective ||
            !formData.suggestedTrainingCourse ||
            formData.priorityId === null ||
            formData.categoryId === null
        ) {
            Swal.fire({
                title: "Error",
                text: "No puedes guardar campos vacíos",
                icon: "error"
            });
            return;
        }

        try {
            Swal.fire({
                title: "Enviando...",
                text: "Por favor, espere mientras se procesa su solicitud",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => Swal.showLoading(),
                customClass: {
                    popup: 'bg-white rounded-lg shadow-xl',
                    title: 'text-xl font-bold text-gray-800',
                    htmlContainer: 'text-gray-600 text-center',
                },
            });

            let response;

            if (trainingNeedId) {
                response = await trainingNeedService.updateTrainingNeed(trainingNeedId, formData);
            } else {
                const { providerAdmin1, providerAdmin2, statusId, ...dataForCreation } = formData;
                response = await trainingNeedService.createTrainingNeed(dataForCreation);
            }

            Swal.close();

            if (response.success) {
                if (!trainingNeedId) {
                    setFormData({
                        presentNeed: '',
                        positionsOrCollaborator: '',
                        suggestedTrainingCourse: '',
                        qualityObjective: '',
                        currentPerformance: '',
                        expectedPerformance: '',
                        providerUser: '',
                        providerAdmin1: '',
                        providerAdmin2: '',
                        registrationDate: new Date().toISOString().split('T')[0],
                        priorityId: 1,
                        categoryId: 0,
                        statusId: 0
                    });
                }

                Swal.fire({
                    title: "¡Éxito!",
                    text: trainingNeedId ? "Registro actualizado" : "Registro guardado",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });

                onSuccess?.();
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.message || "No se pudo completar la operación. Intente nuevamente",
                    icon: "error"
                });
            }
        } catch (error: any) {
            Swal.close();

            if (error.message.includes("401") || error.message.includes("no autenticado")) {
                Swal.fire({
                    title: "Sesión expirada",
                    text: "Por favor, inicia sesión nuevamente",
                    icon: "warning",
                    confirmButtonText: "Ir a login"
                }).then(() => {
                    navigate("/login");
                });
            } else {
                Swal.fire({
                    title: "Error inesperado",
                    text: error instanceof Error ? error.message : "Ocurrió un error inesperado. Intente nuevamente",
                    icon: "error"
                });
            }

            console.error("Error al procesar el formulario", error);
        }
    };

    const priorityOptions = priority.map((priority) => ({
        value: priority.id.toString(),
        label: priority.name
    }));

    const categoryOptions = category.map((category) => ({
        value: category.id.toString(),
        label: category.name
    }));

    const statusOptions = status.map((status) => ({
        value: status.id.toString(),
        label: status.name
    }));

    return (
        <>
            {
                isAuthenticated && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-700">
                            Registrando como <strong>{user?.name}</strong>
                        </p>
                    </div>
                )
            }

            <form onSubmit={handleSubmit} className="space-y-5">
                <FormInput
                    label="Necesidad presente"
                    name="presentNeed"
                    type="textarea"
                    value={formData.presentNeed}
                    onChange={handleChange}
                />

                <FormInput
                    label="Puestos y/o Colaborador a incluir en el entrenamiento"
                    name="positionsOrCollaborator"
                    type="textarea"
                    value={formData.positionsOrCollaborator}
                    onChange={handleChange}
                />

                <FormInput
                    label="Curso / Entrenamiento sugerido"
                    name="suggestedTrainingCourse"
                    type="text"
                    value={formData.suggestedTrainingCourse}
                    onChange={handleChange}
                />

                <FormInput
                    label="Objetivo de calidad / KPI / Medible a mejorar"
                    name="qualityObjective"
                    type="text"
                    value={formData.qualityObjective}
                    onChange={handleChange}
                />

                <FormInput
                    label="Desempeño actual"
                    name="currentPerformance"
                    type="text"
                    value={formData.currentPerformance}
                    onChange={handleChange}
                />

                <FormInput
                    label="Desempeño esperado gracias al curso"
                    name="expectedPerformance"
                    type="text"
                    value={formData.expectedPerformance}
                    onChange={handleChange}
                />

                <FormInput
                    type="select"
                    label="Prioridad"
                    name="priorityId"
                    options={priorityOptions}
                    value={formData.priorityId}
                    onChange={handleChange}
                />

                <FormInput
                    type="select"
                    label="Selecciona una categoría"
                    name="categoryId"
                    options={categoryOptions}
                    value={formData.categoryId}
                    onChange={handleChange}
                />

                <FormInput
                    type="text"
                    label="Propuesta de proveedor"
                    name="providerUser"
                    value={formData.providerUser}
                    onChange={handleChange}
                />

                {trainingNeedId && (
                    <>
                        <FormInput
                            type="text"
                            label="Proveedor Admin 1"
                            name="providerAdmin1"
                            value={formData.providerAdmin1}
                            onChange={handleChange}
                        />

                        <FormInput
                            type="text"
                            label="Proveedor Admin 2"
                            name="providerAdmin2"
                            value={formData.providerAdmin2}
                            onChange={handleChange}
                        />

                        <FormInput
                            type="select"
                            label="Estatus"
                            name="statusId"
                            value={formData.statusId}
                            options={statusOptions}
                            onChange={handleChange}
                        />
                    </>
                )}

                <div className="pt-4 flex justify-end space-x-3">
                    <Button type="submit" variant="secondary" size="sm">
                        GUARDAR
                    </Button>
                </div>
            </form>
        </>
    )
}