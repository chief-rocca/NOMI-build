import { UserProfile } from './user.types';

export interface AuthSession {
    token: string;
    expiresAt: number;
}

export interface AuthResponse {
    user: UserProfile;
    session: AuthSession;
}
