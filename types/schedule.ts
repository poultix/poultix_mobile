import { User } from './user';
import { Farm } from './farm';

// Schedule enums - matches backend
export enum ScheduleStatus {
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    RESCHEDULED = 'RESCHEDULED'
}

export enum ScheduleType {
    INSPECTION = 'INSPECTION',
    VACCINATION = 'VACCINATION',
    TREATMENT = 'TREATMENT',
    CONSULTATION = 'CONSULTATION',
    EMERGENCY = 'EMERGENCY',
    ROUTINE_CHECKUP = 'ROUTINE_CHECKUP'
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
    id: string; // UUID
    title: string;
    description?: string;
    type: ScheduleType;
    farmer: User;
    veterinary: User;
    scheduledDate: string; // ISO date
    status: ScheduleStatus;
    priority: SchedulePriority;
    createdBy: User;
    createdAt: string; // ISO date-time
    updatedAt: string; // ISO date-time
}

// Request types - matches backend
export interface ScheduleCreateRequest {
    title: string;
    description?: string;
    type: ScheduleType;
    veterinary: User;
    scheduledDate: string; // ISO date
    priority: SchedulePriority;
    farm: Farm;
}

export interface ScheduleUpdateRequest {
    title?: string;
    description?: string;
    scheduledDate?: string; // ISO date
    status?: ScheduleStatus;
    priority?: SchedulePriority;
}