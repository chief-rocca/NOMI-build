import { Button } from '@/components/Button';
import { DataInput } from '@/components/DataInput';
import { AuthService } from '@/services/mock/AuthService';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, LayoutAnimation, Platform, StatusBar, Text, View } from 'react-native';

export default function MobilePhoneScreen() {
    const router = useRouter();

    // State for Wizard Step
    const [step, setStep] = useState<'phone' | 'email'>('phone');

    // Form State
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleContinuePhone = () => {
        if (phoneNumber.length < 5) {
            setError('Please enter a valid phone number');
            return;
        }
        setError(null);
        // Animate transition to next step
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setStep('email');
    };

    const handleBackToPhone = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setStep('phone');
    };

    const handleSendOtp = async () => {
        // Validation removed as requested: "input validation is not required for email"

        setError(null);
        setLoading(true);

        try {
            await AuthService.requestOtp(phoneNumber);

            router.push({
                pathname: '/auth/otp',
                params: { phone: phoneNumber, context: 'mobile', email }
            });
            // No need to set loading false if we navigate away, but safe to do so
        } catch (e: any) {
            console.error("OTP Error", e);
            setError(e.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-black/50 px-6 justify-center items-center">
            <StatusBar barStyle="light-content" />

            {/* Interactive Content - Inside KAV */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="w-full z-10 justify-center items-center p-6"
            >
                <View className="bg-white w-full rounded-3xl p-6 shadow-xl space-y-6">

                    {step === 'phone' ? (
                        /* STEP 1: PHONE */
                        <>
                            <View className="flex-row items-center mb-2">
                                <FontAwesome name="mobile-phone" size={32} color="#333" />
                                <Text className="text-2xl font-bold ml-3 text-gray-800">Mobile Login</Text>
                            </View>

                            <Text className="text-gray-600 text-base">
                                Enter your mobile number to sign up:
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
                                        onPress={handleContinuePhone}
                                    />
                                </View>
                            </View>
                        </>
                    ) : (
                        /* STEP 2: EMAIL */
                        <>
                            <View className="flex-row items-center mb-2">
                                <FontAwesome name="envelope-o" size={28} color="#0d47a1" />
                                <Text className="text-2xl font-bold ml-3 text-gray-800">2-Step Verification</Text>
                            </View>

                            <Text className="text-gray-600 text-base">
                                Please provide your email address to validate your account sign up:
                            </Text>

                            <DataInput
                                placeholder="email@example.com"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (error) setError(null);
                                }}
                                error={error || undefined}
                                autoFocus
                            />

                            {error && (
                                <Text className="text-red-500 font-bold">{error}</Text>
                            )}

                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Button
                                        title="Back"
                                        variant="secondary"
                                        shape="squircle"
                                        className="bg-gray-100"
                                        onPress={handleBackToPhone}
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
