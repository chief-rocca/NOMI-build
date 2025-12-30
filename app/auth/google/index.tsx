import { useRouter } from 'expo-router';
import { ChevronDown, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

export default function GoogleMockFlow() {
    const router = useRouter();
    const [step, setStep] = useState<'alert' | 'accounts' | 'confirm'>('alert');
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

    const MOCK_ACCOUNTS = [
        { name: 'NOMI User 1', email: 'nomi_user_01@nomi.id' },
        { name: 'NOMI User 2', email: 'nomi_user_02@nomi.id' },
        { name: 'NOMI User 3', email: 'nomi_user_03@nomi.id' },
    ];

    const handleAccountSelect = (email: string) => {
        setSelectedEmail(email);
        setStep('confirm');
    };

    const handleFinalContinue = () => {
        // Navigate to Mobile/Phone flow (asking for number)
        // Pass the google email if needed, or just context
        router.push({
            pathname: '/auth/mobile/phone',
            params: { context: 'google_linked', googleEmail: selectedEmail }
        });
    };

    // 1. Simulated Native Alert (Dark Theme adaptation or mimicking iOS Dark)
    if (step === 'alert') {
        return (
            <View className="flex-1 bg-black/80 items-center justify-center px-10">
                <View className="bg-gray-800 w-full rounded-xl overflow-hidden">
                    <View className="p-6 items-center">
                        <Text className="text-white text-lg font-bold text-center mb-2">
                            “NOMI” Wants to Use “google.com” to Sign In
                        </Text>
                        <Text className="text-gray-300 text-center text-sm">
                            This allows the app and website to share information about you.
                        </Text>
                    </View>
                    <View className="flex-row border-t border-gray-700">
                        <TouchableOpacity
                            className="flex-1 py-4 border-r border-gray-700 items-center"
                            onPress={() => router.back()}
                        >
                            <Text className="text-blue-400 text-lg font-bold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-1 py-4 items-center"
                            onPress={() => setStep('accounts')}
                        >
                            <Text className="text-blue-400 text-lg font-bold">Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    // 2. Choose Account
    if (step === 'accounts') {
        return (
            <SafeAreaView className="flex-1 bg-nomi-dark-bg">
                <View className="px-4 py-2 border-b border-gray-800 flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-blue-400 font-bold">Cancel</Text>
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-lg">accounts.google.com</Text>
                    <View style={{ width: 50 }} />
                </View>

                <View className="flex-1 items-center pt-10 px-6">
                    <Text className="text-3xl text-white font-bold mb-8 self-start">Choose an account</Text>
                    <Text className="text-white mb-6 self-start">to continue to NOMI</Text>

                    <View className="w-full">
                        {MOCK_ACCOUNTS.map((acc, idx) => (
                            <TouchableOpacity
                                key={idx}
                                className="flex-row items-center py-4 border-b border-gray-800"
                                onPress={() => handleAccountSelect(acc.email)}
                            >
                                <View className="w-10 h-10 rounded-full bg-purple-600 items-center justify-center mr-4">
                                    <Text className="text-white font-bold">{acc.name.charAt(0)}</Text>
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-base">{acc.name}</Text>
                                    <Text className="text-gray-400 text-sm">{acc.email}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-800">
                            <View className="w-10 h-10 rounded-full bg-transparent border border-gray-600 items-center justify-center mr-4">
                                <User size={20} color="white" />
                            </View>
                            <Text className="text-white font-bold text-base">Use another account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    // 3. Confirm Sign In ("Sign in to Ground" style)
    if (step === 'confirm') {
        return (
            <SafeAreaView className="flex-1 bg-nomi-dark-bg justify-between">
                <View className="px-4 py-2 border-b border-gray-800 flex-row items-center justify-start gap-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-blue-400 font-bold">Cancel</Text>
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-lg">accounts.google.com</Text>
                </View>

                <View className="flex-1 px-8 pt-10">
                    <Text className="text-3xl text-white font-bold mb-6">Sign in to NOMI</Text>

                    <View className="flex-row items-center bg-gray-900 rounded-full px-4 py-2 self-start mb-8 border border-gray-700">
                        <View className="w-6 h-6 rounded-full bg-purple-600 items-center justify-center mr-2">
                            <Text className="text-white text-xs">{selectedEmail?.charAt(0).toUpperCase()}</Text>
                        </View>
                        <Text className="text-gray-300 mr-2">{selectedEmail}</Text>
                        <ChevronDown size={14} color="gray" />
                    </View>

                    <Text className="text-gray-300 text-lg mb-8">
                        Google will allow NOMI to access this info about you
                    </Text>

                    <View className="flex-row items-start mb-6">
                        <View className="mt-1 mr-4 bg-gray-800 p-1 rounded-full">
                            <User size={16} color="white" />
                        </View>
                        <View>
                            <Text className="text-gray-400 font-bold text-base mb-1">Name and profile picture</Text>
                            <Text className="text-gray-500 text-sm">See personal info, including any publicly made available info...</Text>
                        </View>
                    </View>

                    <View className="flex-row items-start mb-6">
                        <View className="mt-1 mr-4 bg-gray-800 p-1 rounded-full">
                            <Text className="text-white text-xs">@</Text>
                        </View>
                        <View>
                            <Text className="text-gray-400 font-bold text-base mb-1">Email address</Text>
                            <Text className="text-gray-500 text-sm">See your primary Google Account email address</Text>
                        </View>
                    </View>
                </View>

                <View className="px-6 pb-10 flex-row gap-4">
                    <TouchableOpacity
                        className="flex-1 py-4 rounded-full border border-gray-600 items-center"
                        onPress={() => router.back()}
                    >
                        <Text className="text-white font-bold">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 py-4 rounded-full bg-nomi-primary items-center"
                        onPress={handleFinalContinue}
                    >
                        <Text className="text-white font-bold">Continue</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return null;
}
