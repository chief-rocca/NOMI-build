import { Button } from '@/components/Button';
import { DataInput } from '@/components/DataInput';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, LayoutAnimation, Platform, StatusBar, Text, View } from 'react-native';

export default function GoogleEmailScreen() {
    const router = useRouter();

    // Step state
    const [step, setStep] = useState<'email' | 'mobile'>('email');

    // Data state
    const [email, setEmail] = useState('user_1766529980283@google.com'); // Simulated
    const [phoneNumber, setPhoneNumber] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleContinueEmail = () => {
        // Proceed to Mobile input
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setStep('mobile');
    };

    const handleBackToEmail = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setStep('email');
    };

    const handleSendOtp = () => {
        if (phoneNumber.length < 5) {
            setError('Please enter a valid phone number');
            return;
        }

        router.push({
            pathname: '/auth/otp',
            params: { phone: phoneNumber, context: 'google', email }
        });
    };

    return (
        <View className="flex-1 bg-black/50 px-6 justify-center items-center">
            <StatusBar barStyle="light-content" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="w-full z-10 justify-center items-center p-6"
            >
                <View className="bg-white w-full rounded-3xl p-6 shadow-xl space-y-6">

                    {step === 'email' ? (
                        /* STEP 1: EMAIL (Simulated) */
                        <>
                            <View className="flex-row items-center mb-2">
                                <FontAwesome name="google" size={28} color="#DB4437" />
                                <Text className="text-2xl font-bold ml-3 text-gray-800">Google Login</Text>
                            </View>

                            <Text className="text-gray-600 text-base">
                                Enter your email (simulated):
                            </Text>

                            <DataInput
                                placeholder="email@example.com"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (error) setError(null);
                                }}
                                autoFocus
                            />

                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Button
                                        title="Cancel"
                                        variant="secondary"
                                        shape="squircle"
                                        className="bg-gray-100"
                                        onPress={() => router.back()}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Button
                                        title="Continue"
                                        variant="primary"
                                        shape="squircle"
                                        isLoading={loading}
                                        onPress={handleContinueEmail}
                                    />
                                </View>
                            </View>
                        </>
                    ) : (
                        /* STEP 2: MOBILE */
                        <>
                            <View className="flex-row items-center mb-2">
                                <FontAwesome name="google" size={28} color="#DB4437" />
                                <Text className="text-2xl font-bold ml-3 text-gray-800">Google Login</Text>
                            </View>

                            <Text className="text-gray-600 text-base">
                                Complete your profile by adding your mobile number:
                            </Text>

                            <DataInput
                                key="phone-input"
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
                                        onPress={handleBackToEmail}
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
                        </>
                    )}

                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
