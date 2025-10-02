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



// Response types
export interface HelpSupportResponse {
  id: string;
  userId: string;
  user: {
      id: string;
      name: string;
      email: string;
      role: 'FARMER' | 'VETERINARY' | 'ADMIN';
  };
  subject: string;
  description: string;
  category: 'TECHNICAL' | 'BILLING' | 'FEATURE_REQUEST' | 'BUG_REPORT' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedTo?: {
      id: string;
      name: string;
      email: string;
  };
  attachments?: {
      url: string;
      type: string;
      name: string;
      size: number;
  }[];
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface HelpSupportCreateRequest {
  subject: string;
  description: string;
  category: 'TECHNICAL' | 'BILLING' | 'FEATURE_REQUEST' | 'BUG_REPORT' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  attachments?: {
      url: string;
      type: string;
      name: string;
      size: number;
  }[];
}

export interface FileUploadResponse {
    fileName: string;
    originalFileName: string;
    fileUrl: string;
    contentType: string;
    fileSize: number;
    uploadedAt: string; // ISO date string
}
