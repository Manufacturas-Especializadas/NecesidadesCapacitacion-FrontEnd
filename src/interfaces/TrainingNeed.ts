export interface TrainingNeed {
    id: number;
    presentNeed: string;
    positionsOrCollaborator: string;
    suggestedTrainingCourse: string;
    qualityObjective: string;
    currentPerformance: string;
    expectedPerformance: string;
    registrationDate: string
    priority: number;
    category: number;
    providerUser: string;
}