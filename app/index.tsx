import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Smartphone } from 'lucide-react-native';
import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingScreen() {
    const router = useRouter();

    const handleAppleLogin = () => {
        alert('Apple login coming soon.');
    };

    const handleGoogleLogin = () => {
        // Route to new Mock Google Flow
        router.push('/auth/google');
    };

    const handleNumberLogin = () => {
        // "Number" flow (previously Email button routed here to mobile/phone, so this is consistent)
        router.push('/auth/mobile/phone');
    };

    const handleFacebookLogin = () => {
        alert('Facebook login simulation not implemented in this flow.');
    };



    const SigninButton = ({
        title,
        icon,
        onPress,
        isBrand = false
    }: {
        title: string;
        icon: React.ReactNode;
        onPress: () => void;
        isBrand?: boolean;
    }) => (
        <TouchableOpacity
            onPress={onPress}
            className="w-full flex-row items-center justify-center py-4 px-6 rounded-full border border-gray-700 bg-nomi-dark-surface mb-3 active:bg-gray-800"
        >
            <View className="absolute left-6">
                {icon}
            </View>
            <Text className="text-white font-satoshi-medium text-base text-center">
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-nomi-dark-bg px-6 justify-between py-4">
            <StatusBar barStyle="light-content" />

            {/* Header Section */}
            <View className="flex-1 mt-12">
                {/* Logo */}
                <Text className="text-center text-3xl font-satoshi-bold text-white mb-20 tracking-wider">
                    NOMI
                </Text>


                {/* Main Content */}
                <View className="flex-1 justify-center pb-20">
                    <Text className="text-4xl font-satoshi-bold text-white mb-10 text-center">
                        Create your{'\n'}free account
                    </Text>

                    <View className="w-full">
                        {/* Apple */}
                        <SigninButton
                            title="Continue with Apple"
                            icon={<FontAwesome5 name="apple" size={20} color="white" />}
                            onPress={handleAppleLogin}
                            isBrand
                        />

                        {/* Google */}
                        <SigninButton
                            title="Continue with Google"
                            icon={<FontAwesome5 name="google" size={18} color="white" />}
                            onPress={handleGoogleLogin}
                            isBrand
                        />

                        {/* Number */}
                        <SigninButton
                            title="Continue with Number"
                            icon={<Smartphone size={20} color="white" />}
                            onPress={handleNumberLogin}
                        />

                        {/* Facebook */}
                        <SigninButton
                            title="Continue with Facebook"
                            icon={<FontAwesome5 name="facebook" size={18} color="white" />}
                            onPress={handleFacebookLogin}
                            isBrand
                        />


                    </View>
                </View>
            </View>

            {/* Footer */}
            <View className="pb-8">
                <Text className="text-center text-gray-500 text-xs leading-5 px-4 font-satoshi-regular">
                    By creating an account, you agree to the <Text className="text-white underline">Terms of Service</Text> & acknowledge our <Text className="text-white underline">Privacy Policy</Text>.
                </Text>
            </View>
        </SafeAreaView>
    );
}
