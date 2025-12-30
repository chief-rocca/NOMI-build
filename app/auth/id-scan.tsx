import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';

export default function IDScanScreen() {
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

    const handleStartScan = () => {
        // Mock Scan Process with defined delays
        setStatus('scanning');

        // Simulate "Scanning" delay (2 seconds)
        setTimeout(() => {
            setStatus('success');

            // Simulate "Encryption/Processing" delay (1 second) then navigate
            setTimeout(() => {
                router.replace('/auth/permissions/location');
            }, 1000);
        }, 2000);
    };

    return (
        <View className="flex-1 bg-nomi-bg items-center justify-center px-6">
            <StatusBar barStyle="dark-content" />

            {/* Header Section */}
            <View className="items-center mt-10 mb-8">
                <View className="bg-white/20 p-8 rounded-full mb-8">
                    {status === 'success' ? (
                        <Ionicons name="checkmark-circle" size={60} color="#10B981" />
                    ) : (
                        <FontAwesome5 name="id-card" size={60} color={Colors.light.accent} />
                    )}
                </View>
                <Text className="text-3xl font-extrabold text-gray-800 mb-4 text-center">
                    {status === 'scanning' ? 'Scanning ID...' : status === 'success' ? 'Identity Verified' : 'Verify Identity'}
                </Text>

                {status === 'idle' && (
                    <Text className="text-gray-600 text-center text-base padding-x-4 leading-6">
                        To protect the platform, we need to verify you are a real person.
                    </Text>
                )}
            </View>

            {/* Mock Camera View Logic */}
            {status === 'scanning' && (
                <View className="h-48 w-full bg-black/10 rounded-xl items-center justify-center mb-8 border-2 border-dashed border-gray-400">
                    <ActivityIndicator size="large" color={Colors.light.primary} />
                    <Text className="mt-4 text-gray-600 font-medium">Align ID within frame</Text>
                </View>
            )}

            {status === 'idle' && (
                /* Privacy Note - Critical Requirement */
                <View className="bg-blue-500/10 w-full rounded-xl p-4 flex-row items-start mb-8 border border-blue-500/20">
                    <Ionicons name="lock-closed" size={24} color="#3B82F6" />
                    <Text className="ml-3 text-gray-700 text-sm flex-1 leading-5">
                        Your ID data is used <Text className="font-bold">just once</Text> to confirm validity. It is cryptographically encrypted and made <Text className="font-bold">inaccessible</Text> immediately after verification.
                    </Text>
                </View>
            )}

            {/* Action Button */}
            <View className="w-full">
                {status === 'idle' && (
                    <Button
                        title="Scan ID"
                        onPress={handleStartScan}
                        shape="squircle"
                        icon={<Ionicons name="camera" size={20} color="white" />}
                    />
                )}
                {status === 'scanning' && (
                    <Button
                        title="Scanning..."
                        variant="secondary"
                        shape="squircle"
                        disabled
                    />
                )}
                {status === 'success' && (
                    <Button
                        title="Verified"
                        variant="primary"
                        shape="squircle"
                        disabled
                        className="bg-green-500"
                        icon={<Ionicons name="checkmark" size={20} color="white" />}
                    />
                )}
            </View>

        </View>
    );
}
