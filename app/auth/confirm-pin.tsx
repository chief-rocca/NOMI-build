import { Numpad } from '@/components/Numpad';
import { clsx } from 'clsx';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock } from 'lucide-react-native';
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
                    // Navigate to Permissions flow
                    router.push('/auth/permissions/biometric');
                }, 1500);
            }
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    return (
        <SafeAreaView className="flex-1 bg-nomi-dark-bg">
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View className="px-6 py-4">
                <ArrowLeft size={24} color="white" onPress={() => router.back()} />
            </View>

            <View className="flex-1 items-center justify-center -mt-20">

                {/* Icon */}
                <View className="bg-gray-800 p-8 rounded-full mb-10">
                    <Lock size={48} color="white" />
                </View>

                <Text className="text-3xl font-satoshi-bold text-white mb-2">Confirm PIN</Text>
                <Text className="text-gray-400 mb-14 text-lg font-satoshi-medium">Re-enter your PIN to confirm</Text>

                {/* Dots */}
                <View className="flex-row gap-6 mb-16">
                    {[...Array(maxPinLength)].map((_, i) => (
                        <View
                            key={i}
                            className={clsx(
                                "w-5 h-5 rounded-full border-2 border-gray-600",
                                i < pin.length ? "bg-nomi-primary border-nomi-primary" : "bg-transparent",
                                // Add error state visuals if needed
                            )}
                        />
                    ))}
                </View>

                {/* Numpad */}
                <Numpad onPress={handlePress} onDelete={handleDelete} />

            </View>

            <View className="absolute bottom-10 w-full items-center">
                <Text className="text-gray-500 text-xs font-satoshi-regular">PIN expires after 12 months and cannot be reused</Text>
            </View>

        </SafeAreaView>
    );
}
