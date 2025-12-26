export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    avatarUrl?: string; // For UI polish
    role: 'user' | 'admin';
}

export interface UserSettings {
    biometricsEnabled: boolean;
    notificationsEnabled: boolean;
    currency: string;
}
