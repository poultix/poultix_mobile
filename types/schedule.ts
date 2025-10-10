import { Farm } from "./farm";
import { User, Veterinary } from "./user";

export enum ScheduleType {
    INSPECTION = 'INSPECTION',
    VACCINATION = 'VACCINATION',
    TREATMENT = 'TREATMENT',
    CONSULTATION = 'CONSULTATION',
    EMERGENCY = 'EMERGENCY',
    ROUTINE_CHECKUP = 'ROUTINE_CHECKUP'
}

export enum ScheduleStatus {
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    RESCHEDULED = 'RESCHEDULED'
}

export enum SchedulePriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export interface ScheduleMedication{
    name: string;
    dosage: string;
    duration: string;
}

export interface ScheduleResults {
    findings: string;
    recommendations: string[];
    followUpRequired: boolean;
    followUpDate?: Date;
    medications?: ScheduleMedication[];
}

export interface Schedule {
    id: string;
    title: string;
    description: string;
    type: ScheduleType;
    farmer: User;
    veterinary: User;
    scheduledDate: string;
    status: ScheduleStatus;
    priority: SchedulePriority;
    createdAt: string;
    updatedAt:string;
    createdBy: User;
}

// Request types
export interface ScheduleCreateRequest {
    farm: Farm;
    veterinary: User;
    type: ScheduleType;
    title: string;
    description: string;
    scheduledDate: string;
    priority: SchedulePriority;
}

export interface ScheduleUpdateRequest {
    type: ScheduleType;
    title: string;
    description: string;
    scheduledDate: string; 
    priority: SchedulePriority
}