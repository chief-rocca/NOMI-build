import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
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
                // Success - Go to Dashboard
                // This is the end of the onboarding flow!
                router.replace('/(tabs)');
            } else {
                Alert.alert('Permission Required', 'Location permission is required to use NOMI.');
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

            {/* Header Section */}
            <View className="items-center mt-10 mb-8">
                <View className="bg-white/20 p-8 rounded-full mb-8">
                    <FontAwesome5 name="map-marker-alt" size={60} color={Colors.light.accent} />
                </View>
                <Text className="text-3xl font-extrabold text-gray-800 mb-4 text-center">Enable Location</Text>
                <Text className="text-gray-600 text-center text-base padding-x-4 leading-6">
                    NOMI needs your location to show relevant polls in your area and ensure GDPR compliance.
                </Text>
            </View>

            {/* Info Card */}
            <View className="bg-white/20 w-full rounded-2xl p-6 mb-8 space-y-4">
                <View className="flex-row items-center">
                    <MaterialCommunityIcons name="web" size={24} color="#4A6572" />
                    <Text className="ml-4 text-gray-800 text-base font-medium">View global polls</Text>
                </View>
                <View className="flex-row items-center">
                    <FontAwesome5 name="flag" size={20} color="#4A6572" className="ml-1" />
                    <Text className="ml-4 text-gray-800 text-base font-medium">Access national polls</Text>
                </View>
                <View className="flex-row items-center">
                    <FontAwesome5 name="location-arrow" size={20} color="#4A6572" className="ml-1" />
                    <Text className="ml-4 text-gray-800 text-base font-medium">Participate in local polls</Text>
                </View>
            </View>

            {/* Privacy Note */}
            <View className="bg-emerald-500/10 w-full rounded-xl p-4 flex-row items-start mb-8">
                <Ionicons name="shield-checkmark" size={24} color="#10B981" />
                <Text className="ml-3 text-gray-700 text-sm flex-1 leading-5">
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
                    icon={<FontAwesome5 name="map-marker-alt" size={18} color="white" />}
                />
                <Text className="text-red-500 text-center text-xs mt-4">
                    * Location permission is required to proceed
                </Text>
            </View>

        </View>
    );
}
