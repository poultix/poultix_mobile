import { Farm } from "./Farm"
import { Farmer, FarmerData } from "./Farmer"
import { Vaccine } from "./Vaccine"

export interface Veterinary {
    details: Farmer,
    farmManaged: Farm,
    vaccinesAvailable: Vaccine
}

export interface VeterinaryData extends FarmerData {
    farmManaged: number
}