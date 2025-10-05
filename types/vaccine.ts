// Vaccine Types based on OpenAPI specification

export interface Vaccine {
    id: string;
    name: string;
    type: string;
    targetDisease: string;
    dosage: string;
    administration: string;
    storage: string;
    prescriptionRequired: boolean;
}

export interface VaccineCreateRequest {
    name: string;
    type: string;
    targetDisease: string;
    dosage: string;
    administration: string;
    storage: string;
    prescriptionRequired: boolean;
}

export interface VaccineUpdateRequest {
    name?: string;
    type?: string;
    targetDisease?: string;
    dosage?: string;
    administration?: string;
    storage?: string;
    prescriptionRequired?: boolean;
}

