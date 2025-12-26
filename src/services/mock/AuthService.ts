import { CONFIG } from '@/src/constants/config';
import { MOCK_USER, VALID_OTP } from '@/src/constants/mockData';
import { AuthResponse } from '../api/auth.types';

// Utility helper for random delay
const simulateNetworkDelay = () => {
    const { MIN_LATENCY_MS, MAX_LATENCY_MS } = CONFIG;
    const delay = Math.floor(Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS + 1)) + MIN_LATENCY_MS;
    return new Promise(resolve => setTimeout(resolve, delay));
};

export const AuthService = {
    /**
     * Request an OTP (Simulates sending an SMS)
     */
    requestOtp: async (phoneNumber: string): Promise<boolean> => {
        await simulateNetworkDelay();
        // In a real app, this would call an API. Here, we just "pretend" it worked.
        if (!phoneNumber) throw new Error('Phone number required');
        return true;
    },

    /**
     * Validate OTP and Login
     */
    verifyOtp: async (otp: string): Promise<AuthResponse> => {
        await simulateNetworkDelay();

        if (otp === VALID_OTP) {
            return {
                user: MOCK_USER,
                session: {
                    token: 'mock_session_token_' + Date.now(),
                    expiresAt: Date.now() + 3600 * 1000,
                },
            };
        } else {
            throw new Error('Invalid OTP Code');
        }
    },

    /**
     * Developer helper: Instant Login (No delay)
     */
    devLogin: async (): Promise<AuthResponse> => {
        if (!CONFIG.IS_DEV_MODE) throw new Error('Dev mode disabled');
        return {
            user: MOCK_USER,
            session: {
                token: 'dev_token_' + Date.now(),
                expiresAt: Date.now() + 3600 * 1000,
            },
        };
    }
};
