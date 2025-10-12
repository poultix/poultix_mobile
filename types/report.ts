import { User, Farm } from './index';

// Report enums
export enum ReportType {
    HEALTH = 'HEALTH',
    PRODUCTION = 'PRODUCTION', 
    FINANCIAL = 'FINANCIAL',
    MAINTENANCE = 'MAINTENANCE',
    VACCINATION = 'VACCINATION',
    INSPECTION = 'INSPECTION'
}

export enum ReportStatus {
    COMPLETED = 'COMPLETED',
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    CANCELLED = 'CANCELLED'
}

export enum ReportPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

// Health report specific data
export interface HealthMetrics {
    totalBirds: number;
    healthyBirds: number;
    sickBirds: number;
    mortalityRate: number;
    vaccinationsGiven: number;
    treatmentsGiven: number;
    avgWeight: number;
    temperature: number;
    humidity: number;
}

// Production report specific data
export interface ProductionMetrics {
    eggsCollected: number;
    eggProductionRate: number;
    feedConsumption: number;
    waterConsumption: number;
    avgEggWeight: number;
    hatchabilityRate?: number;
    fertilityRate?: number;
}

// Financial report specific data
export interface FinancialMetrics {
    revenue: number;
    expenses: number;
    profit: number;
    feedCosts: number;
    medicationCosts: number;
    laborCosts: number;
    utilityCosts: number;
    eggSalesRevenue: number;
    birdSalesRevenue: number;
}

// Maintenance report specific data
export interface MaintenanceMetrics {
    equipmentChecked: number;
    issuesFound: number;
    issuesResolved: number;
    maintenanceCosts: number;
    nextMaintenanceDate: string;
    equipmentStatus: 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
}

// Main Report interface
export interface Report {
    id: string; // UUID
    title: string;
    description?: string;
    type: ReportType;
    status: ReportStatus;
    priority: ReportPriority;
    farm: Farm;
    generatedBy: User;
    reviewedBy?: User;
    reportDate: string; // ISO date
    periodStart: string; // ISO date
    periodEnd: string; // ISO date
    
    // Type-specific metrics
    healthMetrics?: HealthMetrics;
    productionMetrics?: ProductionMetrics;
    financialMetrics?: FinancialMetrics;
    maintenanceMetrics?: MaintenanceMetrics;
    
    // Files and attachments
    attachments: string[];
    reportFileUrl?: string;
    
    // Metadata
    createdAt: string; // ISO date-time
    updatedAt: string; // ISO date-time
}

// Request types for reports
export interface ReportCreateRequest {
    title: string;
    description?: string;
    type: ReportType;
    priority: ReportPriority;
    farmId: string; // UUID
    periodStart: string; // ISO date
    periodEnd: string; // ISO date
    
    // Type-specific metrics
    healthMetrics?: HealthMetrics;
    productionMetrics?: ProductionMetrics;
    financialMetrics?: FinancialMetrics;
    maintenanceMetrics?: MaintenanceMetrics;
}

export interface ReportUpdateRequest {
    title?: string;
    description?: string;
    status?: ReportStatus;
    priority?: ReportPriority;
    reviewedBy?: string; // User ID
    
    // Type-specific metrics
    healthMetrics?: HealthMetrics;
    productionMetrics?: ProductionMetrics;
    financialMetrics?: FinancialMetrics;
    maintenanceMetrics?: MaintenanceMetrics;
}

// Filter and search types
export interface ReportFilter {
    type?: ReportType;
    status?: ReportStatus;
    priority?: ReportPriority;
    farmId?: string;
    generatedBy?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
}

// Analytics and summary types
export interface ReportSummary {
    totalReports: number;
    completedReports: number;
    pendingReports: number;
    reportsByType: { [key in ReportType]: number };
    reportsByStatus: { [key in ReportStatus]: number };
    averageCompletionTime: number; // in days
    lastReportDate: string;
}
