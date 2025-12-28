import { Button } from '@/components/Button';
import { DataInput } from '@/components/DataInput';
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/mock/AuthService';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, Text, View } from 'react-native';

export default function GoogleMobileScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const email = params.email as string;

    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendOtp = async () => {
        if (phoneNumber.length < 5) {
            setError('Please enter a valid phone number');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await AuthService.requestOtp(phoneNumber);
            // Navigate to OTP screen with params, passing both email and phone context
            router.push({
                pathname: '/auth/otp',
                params: { phone: phoneNumber, context: 'google', email }
            });
        } catch (e: any) {
            setError(e.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-nomi-bg">
            <StatusBar barStyle="light-content" />

            {/* Background elements outside KAV */}
            <View className="absolute top-0 left-0 right-0 items-center top-28 opacity-80 z-0">
                <View className="bg-white/20 p-6 rounded-full mb-6">
                    <MaterialCommunityIcons name="shield-check" size={48} color={Colors.light.accent} />
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center items-center px-6 z-10"
            >
                <View className=" bg-white w-full rounded-3xl p-6 shadow-xl space-y-6 min-h-[350px] justify-center">

                    <View className="flex-row items-center mb-2">
                        <FontAwesome name="google" size={28} color="#DB4437" />
                        <Text className="text-2xl font-bold ml-3 text-gray-800">2-Step Verification</Text>
                    </View>

                    <Text className="text-gray-600 text-base">
                        To secure your account, please link your mobile number for OTP verification:
                    </Text>

                    <DataInput
                        placeholder="+1234567890"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={(text) => {
                            setPhoneNumber(text);
                            if (error) setError(null);
                        }}
                        error={error || undefined}
                        autoFocus
                    />

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Button
                                title="Back"
                                variant="secondary"
                                shape="squircle"
                                className="bg-gray-100"
                                onPress={() => router.back()}
                            />
                        </View>
                        <View className="flex-1">
                            <Button
                                title="Send OTP"
                                variant="primary"
                                shape="squircle"
                                isLoading={loading}
                                onPress={handleSendOtp}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
