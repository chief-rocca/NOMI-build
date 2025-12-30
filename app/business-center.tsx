import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function BusinessCenterScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-nomi-dark-bg">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1">
                <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ChevronLeft size={28} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">NOMI for Businesses</Text>
                </View>
                <View className="flex-1 justify-center items-center px-8">
                    <Text className="text-white text-2xl font-bold mb-2">Business Center</Text>
                    <Text className="text-gray-400 text-center">
                        Contact us to set up your business profile and access exclusive insights.
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
}
