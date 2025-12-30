import { Button } from '@/components/Button';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { BarChart2, Bell, BellRing, CheckSquare, Trophy } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StatusBar, Text, View } from 'react-native';

export default function NotificationPermissionScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleEnableNotifications = async () => {
        setLoading(true);
        try {
            // Request native permission
            const { status } = await Notifications.requestPermissionsAsync();

            // We proceed regardless of the choice (allow or deny), similar to standard onboarding flow
            // If strictly required, we'd handle 'denied' differently.
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Notification permission error:', error);
            Alert.alert('Error', 'Failed to request permissions');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        router.replace('/(tabs)');
    };

    return (
        <View className="flex-1 bg-nomi-dark-bg items-center justify-center px-6">
            <StatusBar barStyle="light-content" />

            {/* Header Section */}
            <View className="items-center mt-10 mb-8">
                <View className="bg-gray-800 p-8 rounded-full mb-8">
                    <Bell size={60} color="white" />
                </View>
                <Text className="text-3xl font-satoshi-bold text-white mb-4 text-center">Stay Updated</Text>
                <Text className="text-gray-300 text-center text-base padding-x-4 leading-6 font-satoshi-medium">
                    Enable notifications to get real-time updates on polls, results, and community actions.
                </Text>
            </View>

            {/* Info Card */}
            <View className="bg-nomi-dark-surface w-full rounded-2xl p-6 mb-8 space-y-4 border border-gray-800">
                <View className="flex-row items-center">
                    <CheckSquare size={24} color="#4A6572" />
                    <Text className="ml-4 text-gray-300 text-base font-satoshi-medium">New poll alerts</Text>
                </View>
                <View className="flex-row items-center">
                    <BarChart2 size={20} color="#4A6572" className="ml-1" />
                    <Text className="ml-4 text-gray-300 text-base font-satoshi-medium">Live result notifications</Text>
                </View>
                <View className="flex-row items-center">
                    <Trophy size={20} color="#4A6572" className="ml-1" />
                    <Text className="ml-4 text-gray-300 text-base font-satoshi-medium">Milestone achievements</Text>
                </View>
            </View>

            {/* Action Button */}
            <View className="w-full space-y-4">
                <Button
                    title="Enable Notifications"
                    onPress={handleEnableNotifications}
                    isLoading={loading}
                    shape="squircle"
                    icon={<BellRing size={18} color="white" />}
                />
                <Button
                    title="Maybe Later"
                    variant="secondary"
                    onPress={handleSkip}
                    shape="squircle"
                    className="bg-transparent border border-gray-700 mt-2"
                />
            </View>

        </View>
    );
}
