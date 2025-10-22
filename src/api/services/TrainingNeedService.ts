import { API_CONFIG } from "../../config/api";
import type { Prioritys } from "../../interfaces/Prioritys";
import type { TrainingNeed } from "../../interfaces/TrainingNeed";
import type { UserTrainingSummary } from "../../interfaces/UserTrainingSummary";
import { apiClient } from "../client";

export interface TrainingNeedFormData {
    presentNeed: string;
    positionsOrCollaborator: string;
    suggestedTrainingCourse: string;
    qualityObjective: string;
    currentPerformance: string;
    expectedPerformance: string;
    registrationDate: string
    priorityId: number;
};

export interface TrainigNeedResponse {
    success: boolean;
    message?: string;
    trainingId?: string;
    userAssigned?: number;
};

class TrainingNeedService {
    private priorityEndpoint = API_CONFIG.endpoints.training.prioritys;
    private trainingNeedsEndpoint = API_CONFIG.endpoints.training.trainingNeeds;
    private trainingNeedsByUser = API_CONFIG.endpoints.training.trainingNeedsByUser;
    private createEndpoint = API_CONFIG.endpoints.training.create;
    private deleteEndpoint = API_CONFIG.endpoints.training.delete;

    async getPriority(): Promise<Prioritys[]> {
        return apiClient.get<Prioritys[]>(this.priorityEndpoint);
    };

    async getTrainingNeedsByUser(): Promise<UserTrainingSummary[]> {
        return apiClient.get<UserTrainingSummary[]>(this.trainingNeedsByUser);
    };

    async getTrainingNeeds(): Promise<TrainingNeed[]> {
        return apiClient.get<TrainingNeed[]>(this.trainingNeedsEndpoint);
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
};

export const trainingNeedService = new TrainingNeedService();