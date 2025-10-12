// Vaccine Types based on OpenAPI specification

// Vaccine interface - matches backend VaccineDTO exactly
export interface Vaccine {
    id: string; // UUID
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
    name: string;
    type: string;
    targetDisease: string;
    dosage: string;
    administration: string;
    storage: string;
    prescriptionRequired: boolean;
}

