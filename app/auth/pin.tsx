import { Numpad } from '@/components/Numpad';
import { useAuthStore } from '@/store/useAuthStore';
import { clsx } from 'clsx';
import { useRouter } from 'expo-router';
import { AlertCircle, ArrowLeft, Lock } from 'lucide-react-native';
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
                    // Go to Confirm PIN screen (Post-Auth Step 1)
                    router.push('/auth/confirm-pin');
                }, 300);
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

                <Text className="text-3xl font-satoshi-bold text-white mb-2">Create PIN</Text>
                <Text className="text-gray-400 mb-14 text-lg font-satoshi-medium">Set a 5-digit PIN for secure access</Text>

                {/* Dots */}
                <View className="flex-row gap-6 mb-16">
                    {[...Array(maxPinLength)].map((_, i) => (
                        <View
                            key={i}
                            className={clsx(
                                "w-5 h-5 rounded-full border-2 border-gray-600",
                                i < pin.length ? "bg-nomi-primary border-nomi-primary" : "bg-transparent"
                            )}
                        />
                    ))}
                </View>

                {/* Numpad */}
                <Numpad onPress={handlePress} onDelete={handleDelete} />

            </View>

            {/* Footer Info */}
            <View className="absolute bottom-10 w-full items-center">
                <View className="bg-black/50 px-4 py-2 rounded-lg flex-row items-center border border-gray-800">
                    <AlertCircle size={16} color="#EF4444" />
                    <Text className="text-gray-300 ml-2 text-xs font-satoshi-regular">PIN is session-only (resets on restart)</Text>
                </View>
            </View>

        </SafeAreaView>
    );
}
