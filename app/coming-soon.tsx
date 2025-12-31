import { useRouter } from 'expo-router';
import { ArrowLeft, Construction } from 'lucide-react-native';
import React from 'react';
import { StatusBar, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ComingSoonScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-nomi-dark-bg">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="flex-row items-center px-6 py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="bg-gray-800/50 p-2 rounded-full"
                    >
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="flex-1 justify-center items-center px-10">
                    <Animated.View
                        entering={FadeInUp.delay(200).springify()}
                        className="w-32 h-32 bg-nomi-dark-primary/10 rounded-full items-center justify-center mb-10 border border-nomi-dark-primary/30"
                    >
                        <Construction size={48} color="#FFD700" />
                    </Animated.View>

                    <Animated.Text
                        entering={FadeInDown.delay(300).springify()}
                        className="text-white text-3xl font-bold text-center mb-4"
                    >
                        Coming Soon
                    </Animated.Text>

                    <Animated.Text
                        entering={FadeInDown.delay(400).springify()}
                        className="text-gray-400 text-center text-lg leading-6"
                    >
                        We're currently building this feature. Stay tuned for future updates!
                    </Animated.Text>
                </View>
            </SafeAreaView>
        </View>
    );
}
