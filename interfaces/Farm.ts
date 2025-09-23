import { Farmer } from "./Farmer"

export interface FarmData {
    _id: string
    chickens: {
        healthyChickens: number,
        riskChickens: number,
        sickChickens: number
    },
    farmName: string,
    locations: string
}

export interface Farm{
    farmer:Farmer,
    farmName: string,
    location: string,
    chickens: {
        sickChickens: number,
        healthyChickens: number,
        riskChickens: number,
    }
}
