import {  FarmStatus } from "./farm";
import { ScheduleStatus } from "./schedule";
import { UserRole } from "./user";

// Filter and search types
export interface FilterOptions {
    role?: UserRole;
    location?: string;
    healthStatus?: FarmStatus;
    scheduleStatus?: ScheduleStatus;
    dateRange?: {
        start: Date;
        end: Date;
    };
}

export interface SearchOptions {
    query: string;
    fields: string[];
}
