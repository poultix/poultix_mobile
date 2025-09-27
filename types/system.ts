import { Farm } from "./farm";
import { Schedule } from "./schedule";
import { User, Veterinary } from "./user";



export interface AppState {
  currentUser: User | null;
  users: User[];
  farms: Farm[];
  schedules: Schedule[];
  veterinaries: Veterinary[];
  isLoading: boolean;
  error: string | null;
}

