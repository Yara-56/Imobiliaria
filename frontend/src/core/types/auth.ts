// src/core/types/auth.ts
export enum UserRole {
    ADMIN = 'ADMIN',
    OWNER = 'OWNER',
    USER = 'USER',
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
  }
  
  export interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    isInitialLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
  }