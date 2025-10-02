import { Farm } from "./farm";
import { Schedule } from "./schedule";
import { User, Veterinary } from "./user";

export enum SupportType {
  TECHNICAL = 'TECHNICAL',
  BILLING = 'BILLING',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
  BUG_REPORT = 'BUG_REPORT',
  GENERAL = 'GENERAL'
}

export enum SupportPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum SupportStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}



export interface AppState {
  currentUser: User | null;
  users: User[];
  farms: Farm[];
  schedules: Schedule[];
  veterinaries: Veterinary[];
  isLoading: boolean;
  error: string | null;
}

export interface HelpSupport {
  id: string;
  title: string;
  body: string;
  sender: User;
  type: SupportType;
  priority: SupportPriority;
  status: SupportStatus;
  time: string;
  createdAt: string;
  updatedAt: string;
}


// Response types
export interface HelpSupportResponse {
  id: string;
  user: User
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
