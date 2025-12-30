import { Button } from '@/components/Button';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Flag, Globe, MapPin, Navigation, ShieldCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StatusBar, Text, View } from 'react-native';

export default function LocationPermissionScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleEnableLocation = async () => {
        setLoading(true);
        try {
            // Request foreground permission (this triggers native prompt)
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status === 'granted') {
                // Success - Go to Notifications
                router.replace('/auth/permissions/notifications');
            } else {
                Alert.alert('Permission Required', 'Location permission is strictly required to verify your region for voting. You cannot proceed without it.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-nomi-dark-bg items-center justify-center px-6">
            <StatusBar barStyle="light-content" />

            {/* Header Section */}
            <View className="items-center mt-10 mb-8">
                <View className="bg-gray-800 p-8 rounded-full mb-8">
                    <MapPin size={60} color="white" />
                </View>
                <Text className="text-3xl font-satoshi-bold text-white mb-4 text-center">Enable Location</Text>
                <Text className="text-gray-300 text-center text-base padding-x-4 leading-6 font-satoshi-medium">
                    NOMI needs your location to show relevant polls in your area and ensure GDPR compliance.
                </Text>
            </View>

            {/* Info Card */}
            <View className="bg-nomi-dark-surface w-full rounded-2xl p-6 mb-8 space-y-4 border border-gray-800">
                <View className="flex-row items-center">
                    <Globe size={24} color="#4A6572" />
                    <Text className="ml-4 text-gray-300 text-base font-satoshi-medium">View global polls</Text>
                </View>
                <View className="flex-row items-center">
                    <Flag size={20} color="#4A6572" className="ml-1" />
                    <Text className="ml-4 text-gray-300 text-base font-satoshi-medium">Access national polls</Text>
                </View>
                <View className="flex-row items-center">
                    <Navigation size={20} color="#4A6572" className="ml-1" />
                    <Text className="ml-4 text-gray-300 text-base font-satoshi-medium">Participate in local polls</Text>
                </View>
            </View>

            {/* Privacy Note */}
            <View className="bg-emerald-500/10 w-full rounded-xl p-4 flex-row items-start mb-8 border border-emerald-500/20">
                <ShieldCheck size={24} color="#10B981" />
                <Text className="ml-3 text-gray-400 text-sm flex-1 leading-5 font-satoshi-medium">
                    Your identity remains anonymous. Location is used only for poll relevance.
                </Text>
            </View>

            {/* Action Button */}
            <View className="w-full">
                <Button
                    title="Enable Location"
                    onPress={handleEnableLocation}
                    isLoading={loading}
                    shape="squircle"
                    icon={<MapPin size={18} color="white" />}
                />
                <Text className="text-red-500 text-center text-xs mt-4 font-satoshi-bold">
                    * Location permission is required to proceed
                </Text>
            </View>

        </View>
    );
}
