import type { TrainingNeedDetails } from "./TrainingNeedDetails";

export interface UserTrainingSummary {
    id: number;
    userName: string;
    payRollNumber: number;
    role: string;
    trainingNeeds: TrainingNeedDetails[];
    totalNeeds: number;
    highPriorityCount: number;
    mediumPriorityCount: number;
    lowPriorityCount: number;
}