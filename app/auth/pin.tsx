import { Numpad } from '@/components/Numpad';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/useAuthStore';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';


export default function PinScreen() {
    const router = useRouter();
    const [pin, setPin] = useState('');
    const maxPinLength = 5;
    const user = useAuthStore(state => state.user);

    const handlePress = (key: string) => {
        if (pin.length < maxPinLength) {
            const newPin = pin + key;
            setPin(newPin);

            if (newPin.length === maxPinLength) {
                // PIN Complete -> Navigate to "Dashboard" (Tabs)
                // In real app, we would confirm PIN. Here we just assume it's set.
                setTimeout(() => {
                    // We are "logged in" so we can go to tabs?
                    // Actually index is landing. We need a protected layout or redirect.
                    // For now, let's pretend TabOne is Dashboard.
                    router.replace('/(tabs)'); // Go to Dashboard
                }, 300);
            }
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    return (
        <SafeAreaView className="flex-1 bg-nomi-bg">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="px-6 py-4">
                <FontAwesome name="arrow-left" size={24} color="#000" onPress={() => router.back()} />
            </View>

            <View className="flex-1 items-center justify-center -mt-20">

                {/* Icon */}
                <View className="bg-white/30 p-8 rounded-full mb-6">
                    <FontAwesome5 name="lock" size={40} color={Colors.light.accent} />
                </View>

                <Text className="text-3xl font-bold text-gray-800 mb-2">Create PIN</Text>
                <Text className="text-gray-600 mb-10">Set a 5-digit PIN for secure access</Text>

                {/* Dots */}
                <View className="flex-row space-x-6 mb-12">
                    {[...Array(maxPinLength)].map((_, i) => (
                        <View
                            key={i}
                            className={clsx(
                                "w-4 h-4 rounded-full border border-gray-400",
                                i < pin.length ? "bg-white border-white" : "bg-transparent"
                            )}
                        />
                    ))}
                </View>

                {/* Numpad */}
                <Numpad onPress={handlePress} onDelete={handleDelete} />

            </View>

            {/* Footer Info */}
            <View className="absolute bottom-10 w-full items-center">
                <View className="bg-black/80 px-4 py-2 rounded-lg flex-row items-center">
                    <FontAwesome name="exclamation-circle" size={16} color="red" />
                    <Text className="text-white ml-2 text-xs">PIN is session-only (resets on restart)</Text>
                </View>
            </View>

        </SafeAreaView>
    );
}
