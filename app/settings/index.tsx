import { useRouter } from 'expo-router';
import { ChevronRight, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
    const router = useRouter();

    // State for toggles
    const [compactCards, setCompactCards] = useState(false);
    const [hidePaywalls, setHidePaywalls] = useState(false);
    const [hideRead, setHideRead] = useState(false);
    const [autoTranslate, setAutoTranslate] = useState(false);

    const MenuItem = ({ title, subTitle, hasChevron = true, onPress }: { title: string, subTitle?: string, hasChevron?: boolean, onPress?: () => void }) => (
        <TouchableOpacity onPress={onPress} className="flex-row justify-between items-center py-4 px-0">
            <View>
                <Text className="text-white text-base font-medium">{title}</Text>
                {subTitle && <Text className="text-gray-500 text-xs mt-0.5">{subTitle}</Text>}
            </View>
            {hasChevron && <ChevronRight size={20} color="#666" />}
        </TouchableOpacity>
    );

    const ToggleItem = ({ title, subTitle, value, onValueChange }: { title: string, subTitle?: string, value: boolean, onValueChange: (val: boolean) => void }) => (
        <View className="flex-row justify-between items-center py-4 px-0">
            <View className="flex-1 pr-4">
                <View className="flex-row items-center">
                    <Text className="text-white text-base font-medium">{title}</Text>
                    {/* Mock Premium Dot */}
                    <View className="w-2 h-2 bg-yellow-600 rounded-full ml-2" />
                </View>
                {subTitle && <Text className="text-gray-500 text-xs mt-0.5 leading-4">{subTitle}</Text>}
            </View>
            <Switch
                trackColor={{ false: '#333', true: '#fff' }}
                thumbColor={value ? '#000' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );

    const SectionHeader = ({ title }: { title: string }) => (
        <Text className="text-white text-xl font-bold mt-8 mb-2 pb-2 text-nomi-dark-text">{title}</Text>
    );

    return (
        <View className="flex-1 bg-nomi-dark-bg">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1">

                {/* Header */}
                <View className="flex-row justify-between items-center px-4 py-3">
                    <TouchableOpacity onPress={() => router.back()}>
                        <X size={24} color="white" />
                    </TouchableOpacity>

                    <Text className="text-white text-lg font-bold">Settings</Text>

                    <View className="w-6" />
                </View>

                <ScrollView className="px-4" showsVerticalScrollIndicator={false}>

                    {/* Preferences */}
                    <SectionHeader title="Preferences" />

                    <MenuItem title="Manage Notifications" />
                    <MenuItem title="Theme" subTitle="Match System" />

                    {/* Support */}
                    <SectionHeader title="Support" />
                    <MenuItem title="Feedback & Help" />
                    <MenuItem title="FAQ" />
                    <MenuItem title="Help Center" />
                    <MenuItem title="Share NOMI" />
                    <MenuItem title="Suggest Feature" />

                    {/* About */}
                    <SectionHeader title="About" />
                    <MenuItem title="About NOMI" />
                    <MenuItem title="Polling System" />
                    <MenuItem title="Terms & Conditions" />
                    <MenuItem title="Privacy Policy" />
                    <MenuItem title="Sign Out" />

                    <View className="items-center py-8">
                        <Text className="text-gray-500 text-xs">NOMI v1.0.0 (1)</Text>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
