import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Farm, Schedule, Veterinary, AppState, FilterOptions } from '@/types/entities';
import { 
  mockUsers, 
  mockFarms, 
  mockSchedules, 
  mockVeterinaries,
  getUserById,
  getFarmById,
  getScheduleById,
  getVeterinaryById,
  getFarmsByOwner,
  getSchedulesByFarm,
  getSchedulesByVeterinary,
  getFarmsByVeterinary
} from '@/data/mockDatabase';

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'LOAD_DATA'; payload: { users: User[]; farms: Farm[]; schedules: Schedule[]; veterinaries: Veterinary[] } }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'ADD_FARM'; payload: Farm }
  | { type: 'UPDATE_FARM'; payload: Farm }
  | { type: 'DELETE_FARM'; payload: string }
  | { type: 'ADD_SCHEDULE'; payload: Schedule }
  | { type: 'UPDATE_SCHEDULE'; payload: Schedule }
  | { type: 'DELETE_SCHEDULE'; payload: string }
  | { type: 'ADD_VETERINARY'; payload: Veterinary }
  | { type: 'UPDATE_VETERINARY'; payload: Veterinary }
  | { type: 'DELETE_VETERINARY'; payload: string };

// Initial state
const initialState: AppState = {
  currentUser: null,
  users: [],
  farms: [],
  schedules: [],
  veterinaries: [],
  isLoading: false,
  error: null,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'LOAD_DATA':
      return {
        ...state,
        users: action.payload.users,
        farms: action.payload.farms,
        schedules: action.payload.schedules,
        veterinaries: action.payload.veterinaries,
        isLoading: false,
      };
    
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser,
      };
    
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };
    
    case 'ADD_FARM':
      return { ...state, farms: [...state.farms, action.payload] };
    
    case 'UPDATE_FARM':
      return {
        ...state,
        farms: state.farms.map(farm => 
          farm.id === action.payload.id ? action.payload : farm
        ),
      };
    
    case 'DELETE_FARM':
      return {
        ...state,
        farms: state.farms.filter(farm => farm.id !== action.payload),
      };
    
    case 'ADD_SCHEDULE':
      return { ...state, schedules: [...state.schedules, action.payload] };
    
    case 'UPDATE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.map(schedule => 
          schedule.id === action.payload.id ? action.payload : schedule
        ),
      };
    
    case 'DELETE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.filter(schedule => schedule.id !== action.payload),
      };
    
    case 'ADD_VETERINARY':
      return { ...state, veterinaries: [...state.veterinaries, action.payload] };
    
    case 'UPDATE_VETERINARY':
      return {
        ...state,
        veterinaries: state.veterinaries.map(vet => 
          vet.id === action.payload.id ? action.payload : vet
        ),
      };
    
    case 'DELETE_VETERINARY':
      return {
        ...state,
        veterinaries: state.veterinaries.filter(vet => vet.id !== action.payload),
      };
    
    default:
      return state;
  }
};

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Authentication
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  
  // Data fetchers with role-based filtering
  getUsersByRole: (role?: User['role']) => User[];
  getFarmsByUser: (userId: string) => Farm[];
  getSchedulesByUser: (userId: string) => Schedule[];
  getVeterinaryByUser: (userId: string) => Veterinary | undefined;
  
  // CRUD operations
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<User>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  
  createFarm: (farmData: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Farm>;
  updateFarm: (id: string, farmData: Partial<Farm>) => Promise<Farm>;
  deleteFarm: (id: string) => Promise<void>;
  
  createSchedule: (scheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Schedule>;
  updateSchedule: (id: string, scheduleData: Partial<Schedule>) => Promise<Schedule>;
  deleteSchedule: (id: string) => Promise<void>;
  
  createVeterinary: (vetData: Omit<Veterinary, 'id'>) => Promise<Veterinary>;
  updateVeterinary: (id: string, vetData: Partial<Veterinary>) => Promise<Veterinary>;
  deleteVeterinary: (id: string) => Promise<void>;
  
  // Utility functions
  filterData: (filters: FilterOptions) => { users: User[]; farms: Farm[]; schedules: Schedule[] };
  searchData: (query: string, type: 'users' | 'farms' | 'schedules') => any[];
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Load current user from storage if exists
      const savedUserId = await AsyncStorage.getItem('currentUserId');
      if (savedUserId) {
        const user = getUserById(savedUserId);
        if (user) {
          dispatch({ type: 'SET_CURRENT_USER', payload: user });
        } else {
          // User not found, clear invalid session
          await AsyncStorage.removeItem('currentUserId');
        }
      }
      
      // Load all data
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          users: mockUsers,
          farms: mockFarms,
          schedules: mockSchedules,
          veterinaries: mockVeterinaries,
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    }
  };

  // Authentication
  const login = async (email: string, password: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock password validation - in real app this would be handled by backend
    const validCredentials = [
      { email: 'admin@poultix.rw', password: 'admin123' },
      { email: 'john@gmail.com', password: 'farmer123' },
      { email: 'marie.mukamana@gmail.com', password: 'farmer123' },
      { email: 'paul.nzeyimana@gmail.com', password: 'farmer123' },
      { email: 'grace.uwimana@gmail.com', password: 'farmer123' },
      { email: 'dr.patricia@vetcare.rw', password: 'vet123' },
      { email: 'dr.mutesi@animalhealth.rw', password: 'vet123' },
      { email: 'dr.teta@ruralvet.rw', password: 'vet123' },
    ];
    
    const validCredential = validCredentials.find(
      cred => cred.email === email && cred.password === password
    );
    
    if (!validCredential) {
      throw new Error('Invalid email or password');
    }
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User account not found');
    }
    
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
    await AsyncStorage.setItem('currentUserId', user.id);
    
    return user;
  };

  const logout = async (): Promise<void> => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    await AsyncStorage.removeItem('currentUserId');
  };

  // Data fetchers with role-based filtering
  const getUsersByRole = (role?: User['role']): User[] => {
    if (!role) return state.users;
    return state.users.filter(user => user.role === role);
  };

  const getFarmsByUser = (userId: string): Farm[] => {
    const user = getUserById(userId);
    if (!user) return [];
    
    if (user.role === 'admin') {
      return state.farms;
    } else if (user.role === 'farmer') {
      return getFarmsByOwner(userId);
    } else if (user.role === 'veterinary') {
      return getFarmsByVeterinary(userId);
    }
    
    return [];
  };

  const getSchedulesByUser = (userId: string): Schedule[] => {
    const user = getUserById(userId);
    if (!user) return [];
    
    if (user.role === 'admin') {
      return state.schedules;
    } else if (user.role === 'farmer') {
      return state.schedules.filter(schedule => schedule.farmerId === userId);
    } else if (user.role === 'veterinary') {
      return getSchedulesByVeterinary(userId);
    }
    
    return [];
  };

  const getVeterinaryByUser = (userId: string): Veterinary | undefined => {
    return state.veterinaries.find(vet => vet.userId === userId);
  };

  // CRUD operations
  const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
    };
    
    dispatch({ type: 'ADD_USER', payload: newUser });
    return newUser;
  };

  const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUser = getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }
    
    const updatedUser: User = { ...existingUser, ...userData };
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    return updatedUser;
  };

  const deleteUser = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch({ type: 'DELETE_USER', payload: id });
  };

  const createFarm = async (farmData: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>): Promise<Farm> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newFarm: Farm = {
      ...farmData,
      id: `farm-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    dispatch({ type: 'ADD_FARM', payload: newFarm });
    return newFarm;
  };

  const updateFarm = async (id: string, farmData: Partial<Farm>): Promise<Farm> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingFarm = getFarmById(id);
    if (!existingFarm) {
      throw new Error('Farm not found');
    }
    
    const updatedFarm: Farm = { 
      ...existingFarm, 
      ...farmData, 
      updatedAt: new Date() 
    };
    
    dispatch({ type: 'UPDATE_FARM', payload: updatedFarm });
    return updatedFarm;
  };

  const deleteFarm = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch({ type: 'DELETE_FARM', payload: id });
  };

  const createSchedule = async (scheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Schedule> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newSchedule: Schedule = {
      ...scheduleData,
      id: `schedule-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    dispatch({ type: 'ADD_SCHEDULE', payload: newSchedule });
    return newSchedule;
  };

  const updateSchedule = async (id: string, scheduleData: Partial<Schedule>): Promise<Schedule> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingSchedule = getScheduleById(id);
    if (!existingSchedule) {
      throw new Error('Schedule not found');
    }
    
    const updatedSchedule: Schedule = { 
      ...existingSchedule, 
      ...scheduleData, 
      updatedAt: new Date() 
    };
    
    dispatch({ type: 'UPDATE_SCHEDULE', payload: updatedSchedule });
    return updatedSchedule;
  };

  const deleteSchedule = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch({ type: 'DELETE_SCHEDULE', payload: id });
  };

  const createVeterinary = async (vetData: Omit<Veterinary, 'id'>): Promise<Veterinary> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newVeterinary: Veterinary = {
      ...vetData,
      id: `veterinary-${Date.now()}`,
    };
    
    dispatch({ type: 'ADD_VETERINARY', payload: newVeterinary });
    return newVeterinary;
  };

  const updateVeterinary = async (id: string, vetData: Partial<Veterinary>): Promise<Veterinary> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingVet = getVeterinaryById(id);
    if (!existingVet) {
      throw new Error('Veterinary not found');
    }
    
    const updatedVet: Veterinary = { ...existingVet, ...vetData };
    dispatch({ type: 'UPDATE_VETERINARY', payload: updatedVet });
    return updatedVet;
  };

  const deleteVeterinary = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch({ type: 'DELETE_VETERINARY', payload: id });
  };

  // Utility functions
  const filterData = (filters: FilterOptions) => {
    let filteredUsers = state.users;
    let filteredFarms = state.farms;
    let filteredSchedules = state.schedules;

    if (filters.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }

    if (filters.location) {
      filteredUsers = filteredUsers.filter(user => 
        user.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
      filteredFarms = filteredFarms.filter(farm => 
        farm.location.district.toLowerCase().includes(filters.location!.toLowerCase()) ||
        farm.location.sector.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.healthStatus) {
      filteredFarms = filteredFarms.filter(farm => farm.healthStatus === filters.healthStatus);
    }

    if (filters.scheduleStatus) {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.status === filters.scheduleStatus);
    }

    if (filters.dateRange) {
      filteredSchedules = filteredSchedules.filter(schedule => 
        schedule.scheduledDate >= filters.dateRange!.start &&
        schedule.scheduledDate <= filters.dateRange!.end
      );
    }

    return { users: filteredUsers, farms: filteredFarms, schedules: filteredSchedules };
  };

  const searchData = (query: string, type: 'users' | 'farms' | 'schedules'): any[] => {
    const lowerQuery = query.toLowerCase();

    switch (type) {
      case 'users':
        return state.users.filter(user =>
          user.name.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery) ||
          user.location.toLowerCase().includes(lowerQuery)
        );
      
      case 'farms':
        return state.farms.filter(farm =>
          farm.name.toLowerCase().includes(lowerQuery) ||
          farm.location.address.toLowerCase().includes(lowerQuery) ||
          farm.location.district.toLowerCase().includes(lowerQuery)
        );
      
      case 'schedules':
        return state.schedules.filter(schedule =>
          schedule.title.toLowerCase().includes(lowerQuery) ||
          schedule.description.toLowerCase().includes(lowerQuery) ||
          schedule.type.toLowerCase().includes(lowerQuery)
        );
      
      default:
        return [];
    }
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    login,
    logout,
    getUsersByRole,
    getFarmsByUser,
    getSchedulesByUser,
    getVeterinaryByUser,
    createUser,
    updateUser,
    deleteUser,
    createFarm,
    updateFarm,
    deleteFarm,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    createVeterinary,
    updateVeterinary,
    deleteVeterinary,
    filterData,
    searchData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
