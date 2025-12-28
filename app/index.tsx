import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingScreen() {
    const router = useRouter();

    const handleGoogleLogin = () => {
        router.push('/auth/google/email');
    };

    const handleFacebookLogin = () => {
        alert('Facebook login simulation not implemented in this flow.');
    };

    const handleMobileLogin = () => {
        router.push('/auth/mobile/phone');
    };

    return (
        <SafeAreaView className="flex-1 bg-nomi-bg items-center justify-between py-10">
            <StatusBar barStyle="dark-content" />

            {/* Header / Logo Section */}
            <View className="items-center mt-10">
                <View className="bg-white/20 p-8 rounded-full mb-8">
                    <MaterialCommunityIcons name="shield-check" size={80} color={Colors.light.accent} />
                </View>
                <Text className="text-4xl font-extrabold text-nomi-primary tracking-wider mb-2">
                    <Text className="text-nomi-accent">NO</Text>MI
                </Text>
                <Text className="text-gray-700 text-lg font-medium">
                    Anonymous Polling Platform
                </Text>
            </View>

            {/* Action Buttons */}
            <View className="w-full px-8 space-y-4">
                <Button
                    title="Sign up with Google"
                    variant="white"
                    onPress={handleGoogleLogin}
                    icon={<FontAwesome name="google" size={20} color="#DB4437" />}
                    className="mb-4"
                />
                <Button
                    title="Sign up with Facebook"
                    variant="white"
                    onPress={handleFacebookLogin}
                    icon={<FontAwesome name="facebook" size={20} color="#4267B2" />}
                    className="mb-4"
                />
                <Button
                    title="Use mobile number"
                    variant="white"
                    onPress={handleMobileLogin}
                    icon={<FontAwesome name="mobile-phone" size={24} color="#333" />}
                />
            </View>

            {/* Footer */}
            <View className="px-10">
                <Text className="text-center text-gray-600 text-sm leading-5">
                    By signing up, you agree to our <Text className="text-nomi-primary font-bold">Terms</Text>. See how we use your data in our <Text className="text-nomi-primary font-bold">Privacy Policy</Text>.
                </Text>
            </View>
        </SafeAreaView>
    );
}
