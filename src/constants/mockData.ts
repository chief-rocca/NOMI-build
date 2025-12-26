import { UserProfile } from '../services/api/user.types';

export const MOCK_USER: UserProfile = {
    id: 'usr_123456789',
    firstName: 'Junii',
    lastName: 'Dev',
    email: 'junii@nomi.app',
    phoneNumber: '+1 555 0199',
    avatarUrl: 'https://ui-avatars.com/api/?name=Junii+Dev&background=random',
    role: 'user',
};

// Simulation Constants
export const VALID_OTP = '123456';
