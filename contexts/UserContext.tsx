import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import { MockDataService } from '@/services/mockData';

// User state interface
interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

// User actions
type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_CURRENT_USER'; payload: User | null };

// Context types
interface UserContextType {
  state: UserState;
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  // CRUD functions for hooks to call
  setUsers: (users: User[] | ((prev: User[]) => User[])) => void;
  addUser: (user: User) => void;
  editUser: (user: User) => void;
  deleteUser: (id: string) => void;
  setCurrentUser: (user: User | null) => void;
  refreshUsers: () => Promise<void>;
}

// Initial state
const initialState: UserState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
};

// Reducer
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_USERS':
      return { ...state, users: action.payload, isLoading: false, error: null };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        )
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload
      };
    default:
      return state;
  }
};

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const users = await MockDataService.getUsers();
      dispatch({ type: 'SET_USERS', payload: users });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load users' });
    }
  };

  // CRUD functions for hooks to call
  const setUsers = (users: User[] | ((prev: User[]) => User[])) => {
    if (typeof users === 'function') {
      dispatch({ type: 'SET_USERS', payload: users(state.users) });
    } else {
      dispatch({ type: 'SET_USERS', payload: users });
    }
  };

  const addUser = (user: User) => {
    dispatch({ type: 'ADD_USER', payload: user });
  };

  const editUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const deleteUser = (id: string) => {
    dispatch({ type: 'DELETE_USER', payload: id });
  };

  const setCurrentUser = (user: User | null) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
  };

  const refreshUsers = async (): Promise<void> => {
    await loadUsers();
  };

  const contextValue: UserContextType = {
    state,
    users: state.users,
    currentUser: state.currentUser,
    isLoading: state.isLoading,
    error: state.error,
    setUsers,
    addUser,
    editUser,
    deleteUser,
    setCurrentUser,
    refreshUsers,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Hook
export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};