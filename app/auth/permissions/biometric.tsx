import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StatusBar, Text, View } from 'react-native';

export default function BiometricPermissionScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleEnableBiometrics = async () => {
        setLoading(true);
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                Alert.alert('Not Supported', 'Biometric hardware not available on this device.');
                // Proceed anyway for demo
                router.push('/auth/permissions/location');
                return;
            }

            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                Alert.alert('Not Enrolled', 'Please set up biometrics in your device settings.');
                // Proceed anyway for demo
                router.push('/auth/permissions/location');
                return;
            }

            // Request authentication (this triggers native prompt)
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Enable FaceID/TouchID for NOMI',
            });

            if (result.success) {
                // Success - navigate to Location
                router.push('/auth/permissions/location');
            } else {
                // Failed or Cancelled - user can try again or we can let them skip/fail
                Alert.alert('Authentication Failed', 'Biometric verification failed.');
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-nomi-bg items-center justify-center px-6">
            <StatusBar barStyle="dark-content" />

            <View className="items-center mb-10">
                <View className="bg-white/30 p-10 rounded-full mb-10">
                    <Ionicons name="finger-print" size={80} color={Colors.light.accent} />
                </View>

                <Text className="text-3xl font-bold text-gray-800 mb-4 text-center">Enable Biometrics</Text>

                <Text className="text-gray-600 text-center text-lg leading-6 px-4">
                    Secure your account with FaceID or TouchID for faster, secure access.
                </Text>
            </View>

            {/* Info Card similar to Location Screen */}
            <View className="bg-white/20 p-6 rounded-2xl w-full mb-10 space-y-4">
                <View className="flex-row items-center">
                    <Ionicons name="shield-checkmark-outline" size={24} color="#0d47a1" />
                    <Text className="ml-4 text-gray-700 text-base">Encryption standards</Text>
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="key-outline" size={24} color="#0d47a1" />
                    <Text className="ml-4 text-gray-700 text-base">Secure enclave storage</Text>
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="lock-closed-outline" size={24} color="#0d47a1" />
                    <Text className="ml-4 text-gray-700 text-base">Private & local only</Text>
                </View>
            </View>

            <View className="w-full">
                <Button
                    title="Enable Biometrics"
                    onPress={handleEnableBiometrics}
                    isLoading={loading}
                    shape="squircle"
                    icon={<Ionicons name="finger-print" size={24} color="white" />}
                />
                {/* Optional Skip */}
                <Text
                    className="text-gray-500 text-center mt-6 font-medium"
                    onPress={() => router.push('/auth/permissions/location')}>
                    Skip for now
                </Text>
            </View>
        </View>
    );
}
