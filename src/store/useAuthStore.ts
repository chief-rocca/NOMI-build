import { create } from 'zustand';
import { AuthSession } from '../services/api/auth.types';
import { UserProfile } from '../services/api/user.types';

interface AuthState {
    isAuthenticated: boolean;
    user: UserProfile | null;
    session: AuthSession | null;

    // Actions
    login: (user: UserProfile, session: AuthSession) => void;
    logout: () => void;
    updateUser: (updates: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    session: null,

    login: (user, session) => set({
        isAuthenticated: true,
        user,
        session
    }),

    logout: () => set({
        isAuthenticated: false,
        user: null,
        session: null
    }),

    updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
    })),
}));
