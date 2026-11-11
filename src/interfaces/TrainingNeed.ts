export interface TrainingNeed {
    id: number;
    presentNeed: string;
    positionsOrCollaborator: string;
    suggestedTrainingCourse: string;
    qualityObjective: string;
    currentPerformance: string;
    expectedPerformance: string;
    registrationDate: string | null;
    priority: number;
    category: number;
    providerUser: string;
    providerAdmin1: string;
    providerAdmin2: string;
    priorityId: number;
    categoryId: number;
    statusId: number;
    status: number;
}