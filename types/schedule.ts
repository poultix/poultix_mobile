import { User } from "./user";

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
    scheduledDate: Date;
    startTime: string; 
    endTime: string;
    status: ScheduleStatus;
    priority: SchedulePriority;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User;
}

// Request types
export interface ScheduleCreateRequest {
    farmId: string;
    veterinaryId: string;
    farmerId: string;
    type: 'INSPECTION' | 'VACCINATION' | 'TREATMENT' | 'CONSULTATION' | 'EMERGENCY';
    title: string;
    description?: string;
    scheduledDate: string; // ISO date string
    startTime: string;
    endTime: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    notes?: string;
}

export interface ScheduleUpdateRequest {
    farmId?: string;
    veterinaryId?: string;
    type?: 'INSPECTION' | 'VACCINATION' | 'TREATMENT' | 'CONSULTATION' | 'EMERGENCY';
    title?: string;
    description?: string;
    scheduledDate?: string; // ISO date string
    startTime?: string;
    endTime?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    notes?: string;
}