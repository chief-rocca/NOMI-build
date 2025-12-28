import { Button } from '@/components/Button';
import { DataInput } from '@/components/DataInput';
import { Colors } from '@/constants/Colors';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, Text, View } from 'react-native';

export default function GoogleEmailScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('user_1766529980283@google.com'); // Simulated pre-filled
    const [loading, setLoading] = useState(false);

    const handleContinue = () => {
        // Navigate to Step 2: Mobile validation
        router.push({
            pathname: '/auth/google/mobile',
            params: { email }
        });
    };

    return (
        <View className="flex-1 bg-nomi-bg">
            <StatusBar barStyle="light-content" />

            <View className="absolute top-0 left-0 right-0 items-center top-28 opacity-80 z-0">
                <View className="bg-white/20 p-6 rounded-full mb-6">
                    <MaterialCommunityIcons name="shield-check" size={48} color={Colors.light.accent} />
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center items-center px-6 z-10"
            >
                <View className="bg-white w-full rounded-3xl p-6 shadow-xl space-y-6 min-h-[350px] justify-center">

                    <View className="flex-row items-center mb-2">
                        <FontAwesome name="google" size={28} color="#DB4437" />
                        <Text className="text-2xl font-bold ml-3 text-gray-800">Google Login</Text>
                    </View>

                    <Text className="text-gray-600 text-base">
                        Enter your email (simulated):
                    </Text>

                    <DataInput
                        placeholder="email@example.com"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoFocus
                    />

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Button
                                title="Cancel"
                                variant="secondary"
                                shape="squircle"
                                className="bg-gray-100"
                                onPress={() => router.back()}
                            />
                        </View>
                        <View className="flex-1">
                            <Button
                                title="Continue"
                                variant="primary"
                                shape="squircle"
                                isLoading={loading}
                                onPress={handleContinue}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
