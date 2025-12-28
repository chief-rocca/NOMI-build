import { Button } from '@/components/Button'; // Assuming Button is available
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/mock/AuthService';
import { useAuthStore } from '@/store/useAuthStore';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';

export default function OtpScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const phone = params.phone as string;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const login = useAuthStore(state => state.login);

    const handleOtpFilled = async (code: string) => {
        if (code.length !== 6) return;

        setLoading(true);
        setError(null);

        try {
            const { user, session } = await AuthService.verifyOtp(code);
            login(user, session);
            // Navigate to PIN creation logic or Dashboard
            // Navigate to PIN creation logic or Dashboard
            // Clear the stack (remove modala) and go to PIN
            if (router.canDismiss()) {
                router.dismissAll();
            }
            // Small delay to allow dismiss animation to start/finish before pushing new screen
            setTimeout(() => {
                router.push('/auth/pin');
            }, 100);
        } catch (e: any) {
            setError('Invalid code. Try 123456'); // Hint for demo
            setLoading(false); // Make sure to stop loading on error
        }
    };

    return (
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="w-full"
            >
                <View className="bg-white w-full rounded-3xl p-6 shadow-xl items-center">

                    {/* Header Icon */}
                    <View className="bg-blue-50 p-6 rounded-full mb-6">
                        <FontAwesome name="envelope-o" size={40} color={Colors.light.accent} />
                    </View>

                    <Text className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</Text>
                    <Text className="text-gray-600 text-center mb-8">
                        Enter the 6-digit code sent to {'\n'}
                        <Text className="font-bold">{phone || '+1234567890'}</Text>
                    </Text>

                    {/* OTP Input */}
                    <View className="w-full h-16 mb-6">
                        <OtpInput
                            numberOfDigits={6}
                            focusColor={Colors.light.primary}
                            focusStickBlinkingDuration={500}
                            onTextChange={(text) => {
                                if (error) setError(null);
                            }}
                            onFilled={(text) => handleOtpFilled(text)}
                            theme={{
                                pinCodeContainerStyle: {
                                    backgroundColor: '#F3F4F6', // light gray
                                    borderRadius: 8,
                                    width: 45,
                                    height: 55,
                                    borderWidth: 0,
                                },
                                pinCodeTextStyle: {
                                    color: 'black',
                                    fontSize: 24,
                                    fontWeight: 'bold',
                                }
                            }}
                        />
                    </View>

                    {error && (
                        <Text className="text-red-500 font-bold mb-4">{error}</Text>
                    )}

                    <Text className="text-nomi-primary text-xs italic mb-8">
                        (Simulated - enter any 6 digits or 123456)
                    </Text>

                    <Button
                        title="Verify"
                        onPress={() => { }} // OTP input handles submission automatically, but maybe good to have manual
                        variant="primary"
                        shape="squircle"
                        className="w-full opacity-0 h-0" // Hidden button if we rely on auto-submit, or just show loading state
                        isLoading={loading}
                    />
                    {/* Or just a 'Cancel' / 'Back' button */}
                    <Text className="text-gray-400 mt-4" onPress={() => router.back()}>Cancel</Text>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
