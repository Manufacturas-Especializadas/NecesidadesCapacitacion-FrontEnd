import { API_CONFIG } from "../../config/api";
import type { Category } from "../../interfaces/Category";
import type { Prioritys } from "../../interfaces/Prioritys";
import type { Status } from "../../interfaces/Status";
import type { TrainingNeed } from "../../interfaces/TrainingNeed";
import type { UserTrainingSummary } from "../../interfaces/UserTrainingSummary";
import { apiClient } from "../client";

export interface TrainingNeedFormData {
    presentNeed: string;
    positionsOrCollaborator: string;
    suggestedTrainingCourse: string;
    qualityObjective: string;
    currentPerformance: string;
    providerUser: string,
    providerAdmin1?: string;
    providerAdmin2?: string;
    expectedPerformance: string;
    registrationDate: string
    priorityId: number;
    categoryId: number;
    statusId?: number;
};

export interface TrainigNeedResponse {
    success: boolean;
    message?: string;
    trainingId?: string;
    userAssigned?: number;
};

class TrainingNeedService {
    private priorityEndpoint = API_CONFIG.endpoints.training.prioritys;
    private statusEndpoint = API_CONFIG.endpoints.training.status;
    private categoryEndpoint = API_CONFIG.endpoints.training.categorys;
    private trainingNeedsEndpoint = API_CONFIG.endpoints.training.trainingNeeds;
    private getTrainingNeedsByIdEndpoint = API_CONFIG.endpoints.training.getTrainingNeedById;
    private trainingNeedsByUser = API_CONFIG.endpoints.training.trainingNeedsByUser;
    private downloadExcelEndpoint = API_CONFIG.endpoints.training.downloadExcel;
    private createEndpoint = API_CONFIG.endpoints.training.create;
    private updateEndpoint = API_CONFIG.endpoints.training.update;
    private deleteEndpoint = API_CONFIG.endpoints.training.delete;

    async getPriority(): Promise<Prioritys[]> {
        return apiClient.get<Prioritys[]>(this.priorityEndpoint);
    };

    async getCategory(): Promise<Category[]> {
        return apiClient.get<Category[]>(this.categoryEndpoint);
    };

    async getStatus(): Promise<Status[]> {
        return apiClient.get<Status[]>(this.statusEndpoint);
    };

    async getTrainingNeedsByUser(): Promise<UserTrainingSummary[]> {
        return apiClient.get<UserTrainingSummary[]>(this.trainingNeedsByUser);
    };

    async getTrainingNeedsById(id: number | string): Promise<TrainingNeed | null> {
        const url = `${this.getTrainingNeedsByIdEndpoint}${id}`;
        try {
            const response = await apiClient.get<TrainingNeed>(url);
            return response;
        } catch (error) {
            console.error("Error fetching trainingNeeds by id: ", error);
            return null
        }
    };

    async getTrainingNeeds(): Promise<TrainingNeed[]> {
        return apiClient.get<TrainingNeed[]>(this.trainingNeedsEndpoint);
    };

    async downloadExcel(): Promise<void> {
        await apiClient.downloadFile(this.downloadExcelEndpoint, "necesidades_capacitacion.xlsx");
    };

    async deleteTrainingNeed(id: number | string): Promise<TrainigNeedResponse> {
        return apiClient.delete<TrainigNeedResponse>(`${this.deleteEndpoint}${id}`);
    };

    async createTrainingNeed(formData: TrainingNeedFormData): Promise<TrainigNeedResponse> {
        const response = await apiClient.post<TrainigNeedResponse>(
            this.createEndpoint,
            formData
        );

        return response;
    };

    async updateTrainingNeed(id: number, formData: TrainingNeedFormData): Promise<TrainigNeedResponse> {
        const response = await apiClient.put<TrainigNeedResponse>(
            `${this.updateEndpoint}${id}`,
            formData
        );

        return response;
    };
};

export const trainingNeedService = new TrainingNeedService();