import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/mock/AuthService';
import { useAuthStore } from '@/store/useAuthStore';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';
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
            // As per flow: OTP -> Create PIN -> Dashboard
            router.push('/auth/pin');
        } catch (e: any) {
            setError('Invalid code. Try 123456'); // Hint for demo
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-nomi-bg">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="px-6 py-4">
                <FontAwesome name="arrow-left" size={24} color="#000" onPress={() => router.back()} />
            </View>

            <View className="flex-1 px-8 items-center pt-10">

                {/* Icon */}
                <View className="bg-white/30 p-8 rounded-full mb-8">
                    <FontAwesome name="envelope-o" size={48} color={Colors.light.accent} />
                </View>

                <Text className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</Text>
                <Text className="text-gray-600 text-center mb-10">
                    Enter the 6-digit code sent to {'\n'}
                    <Text className="font-bold">{phone || '+1234567890'}</Text>
                </Text>

                <Text className="text-nomi-primary text-sm italic mb-6">
                    (Simulated - enter any 6 digits or 123456)
                </Text>

                {/* OTP Input */}
                <View className="w-full h-20 mb-6">
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
                                backgroundColor: 'white',
                                borderRadius: 12,
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

            </View>
        </SafeAreaView>
    );
}
