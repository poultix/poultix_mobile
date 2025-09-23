import { Farmer } from "./Farmer"
import { Veterinary } from "./Veterinary"

export interface Schedule{
    veterinary: Veterinary,
    farmer: Farmer,
    time: {
        startDate: Date,
        startHour: Date,
        endDate: Date,
        endHour: Date,
    }
}