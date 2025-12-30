import { Megaphone } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';

export default function PoliticsScreen() {
    return (
        <View className="flex-1 bg-nomi-dark-bg">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1 justify-center items-center px-8">
                <View className="w-24 h-24 bg-purple-500/20 rounded-full items-center justify-center mb-6">
                    <Megaphone size={48} color="#A855F7" />
                </View>
                <Text className="text-white text-3xl font-bold mb-4">Politics</Text>
                <Text className="text-gray-400 text-center text-base px-2 leading-6">
                    As global governance faces rising logistical complexity and prohibitive election costs, NOMI is engineering the next frontier of civic engagement.
                    {'\n\n'}
                    Our upcoming Politics Module is designed as a high-integrity, digital framework for national referendums and electoral cycles.
                    {'\n\n'}
                    By transitioning from legacy analog infrastructure to verified digital ballots, we empower nations to drastically reduce the cost of democracy while increasing accessibility for every citizen. The future of sovereign decision-making is no longer a destination—it’s an instantaneous reality.
                </Text>
            </SafeAreaView>
        </View>
    );
}
