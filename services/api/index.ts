// Export all API services
export { adminService, AdminService } from './admin';
export { userService, UserService } from './user';
export { farmService, FarmService } from './farm';
export { veterinaryService, VeterinaryService } from './veterinary';
export { scheduleService, ScheduleService } from './schedule';
export { deviceService, DeviceService } from './device';
export { newsService, NewsService } from './news';
export { messageService, MessageService } from './message';
export { pharmacyService, PharmacyService } from './pharmacy';
export { sensorReadingService, SensorReadingService } from './sensor';
export { supportService, SupportService } from './support';

// Export types
export type {
    UserRegistrationRequest,
    UserUpdateRequest,
} from './user';

export type {
    FarmCreateRequest,
    FarmUpdateRequest,
} from './farm';

export type {
    VeterinaryResponse,
    VeterinaryCreateRequest,
    VeterinaryUpdateRequest,
} from './veterinary';

export type {
    ScheduleCreateRequest,
    ScheduleUpdateRequest,
} from './schedule';

export type {
    DeviceResponse,
    DeviceCreateRequest,
    DeviceUpdateRequest,
} from './device';

export type {
    NewsCreateRequest,
    NewsUpdateRequest,
} from './news';

export type {
    MessageResponse,
    MessageCreateRequest,
} from './message';

export type {
    PharmacyCreateRequest,
    PharmacyUpdateRequest,
} from './pharmacy';

export type {
    SensorReadingResponse,
    SensorReadingCreateRequest,
} from './sensor';

export type {
    HelpSupportResponse,
    HelpSupportCreateRequest,
} from './support';

export type {
    AdminStats,
    SystemMetric,
    Alert,
    ChartData,
    UpdateUserStatusRequest,
} from './admin';