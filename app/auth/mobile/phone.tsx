import { Button } from '@/components/Button';
import { DataInput } from '@/components/DataInput';
import { Colors } from '@/constants/Colors';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, Text, View } from 'react-native';

export default function MobilePhoneScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleContinue = () => {
        if (phoneNumber.length < 5) {
            setError('Please enter a valid phone number');
            return;
        }

        // Navigate to Step 2: Email validation
        router.push({
            pathname: '/auth/mobile/email',
            params: { phone: phoneNumber }
        });
    };

    return (
        <View className="flex-1 bg-nomi-bg">
            <StatusBar barStyle="light-content" />

            {/* Background Elements - Outside KAV to stay static */}
            <View className="absolute top-0 left-0 right-0 items-center top-28 opacity-80 z-0">
                <View className="bg-white/20 p-6 rounded-full mb-6">
                    <MaterialCommunityIcons name="shield-check" size={48} color={Colors.light.accent} />
                </View>
            </View>

            {/* Interactive Content - Inside KAV */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center items-center px-6 z-10"
            >
                <View className="bg-white w-full rounded-3xl p-6 shadow-xl space-y-6 min-h-[350px] justify-center">

                    <View className="flex-row items-center mb-2">
                        <FontAwesome name="mobile-phone" size={32} color="#333" />
                        <Text className="text-2xl font-bold ml-3 text-gray-800">Mobile Login</Text>
                    </View>

                    <Text className="text-gray-600 text-base">
                        Enter your mobile number to sign up:
                    </Text>

                    <DataInput
                        placeholder="+1234567890"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={(text) => {
                            setPhoneNumber(text);
                            if (error) setError(null);
                        }}
                        error={error || undefined}
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
