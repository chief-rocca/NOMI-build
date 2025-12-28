import { Numpad } from '@/components/Numpad';
import { Colors } from '@/constants/Colors';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';

export default function ConfirmPinScreen() {
    const router = useRouter();
    const [pin, setPin] = useState('');
    const maxPinLength = 5;
    const [error, setError] = useState<string | null>(null);

    // In a real app, pass the first PIN via params to compare.
    // For this mock, we'll assume any 5-digit PIN is "confirmed" or just accept it.
    // Or better, let's just make them re-enter.

    const handlePress = (key: string) => {
        if (pin.length < maxPinLength) {
            const newPin = pin + key;
            setPin(newPin);

            if (newPin.length === maxPinLength) {
                // Navigate to Biometric Permission
                setTimeout(() => {
                    router.push('/auth/permissions/biometric');
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
                <View className="bg-white/30 p-8 rounded-full mb-10">
                    <FontAwesome5 name="lock" size={48} color={Colors.light.accent} />
                </View>

                <Text className="text-3xl font-bold text-gray-800 mb-2">Confirm PIN</Text>
                <Text className="text-gray-600 mb-14 text-lg">Re-enter your PIN to confirm</Text>

                {/* Dots */}
                <View className="flex-row gap-6 mb-16">
                    {[...Array(maxPinLength)].map((_, i) => (
                        <View
                            key={i}
                            className={clsx(
                                "w-5 h-5 rounded-full border-2 border-gray-400",
                                i < pin.length ? "bg-white border-white" : "bg-transparent",
                                // Add error state visuals if needed
                            )}
                        />
                    ))}
                </View>

                {/* Numpad */}
                <Numpad onPress={handlePress} onDelete={handleDelete} />

            </View>

            <View className="absolute bottom-10 w-full items-center">
                <Text className="text-gray-500 text-xs">PIN expires after 12 months and cannot be reused</Text>
            </View>

        </SafeAreaView>
    );
}
