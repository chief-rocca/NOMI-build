import { useRouter } from 'expo-router';
import { ChevronRight, Globe, Settings, ShieldCheck, X } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();

    const MenuItem = ({ title, hasChevron = true, onPress }: { title: string, hasChevron?: boolean, onPress?: () => void }) => (
        <TouchableOpacity onPress={onPress} className="flex-row justify-between items-center py-4 px-0">
            <Text className="text-white text-base font-medium">{title}</Text>
            {hasChevron && <ChevronRight size={20} color="#666" />}
        </TouchableOpacity>
    );

    const SectionHeader = ({ title }: { title: string }) => (
        <Text className="text-white text-xl font-bold mt-8 mb-2">{title}</Text>
    );

    const [showAnalytics, setShowAnalytics] = React.useState(false);

    // Mock Analytics Data
    const analyticsData = React.useMemo(() => {
        return Array.from({ length: 7 }).map(() => Math.floor(Math.random() * 100)); // 7 days
    }, [showAnalytics]);

    const AnalyticsOverlay = () => (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/90 px-4 justify-center items-center z-50">
            <TouchableOpacity
                onPress={() => setShowAnalytics(false)}
                className="absolute top-12 right-4 p-2 bg-gray-800 rounded-full"
            >
                <X size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-white mb-2">Your Activity</Text>
            <Text className="text-gray-400 mb-8">Weekly Voting Insights</Text>

            <View className="flex-row items-end justify-between w-full h-64 bg-gray-900 rounded-2xl p-6 border border-gray-800">
                {analyticsData.map((value, index) => (
                    <View key={index} className="items-center gap-2">
                        <View
                            style={{ height: `${value}%`, width: 24 }}
                            className="bg-nomi-primary rounded-t-md opacity-80"
                        />
                        <Text className="text-gray-500 text-xs">Day {index + 1}</Text>
                    </View>
                ))}
            </View>

            <View className="flex-row justify-between w-full mt-8">
                <View className="bg-gray-900 p-4 rounded-xl flex-1 mr-2 items-center border border-gray-800">
                    <Text className="text-white text-2xl font-bold">{analyticsData.reduce((a, b) => a + b, 0)}</Text>
                    <Text className="text-gray-500 text-xs uppercase tracking-wider mt-1">Total Votes</Text>
                </View>
                <View className="bg-gray-900 p-4 rounded-xl flex-1 ml-2 items-center border border-gray-800">
                    <Text className="text-white text-2xl font-bold">Top 5%</Text>
                    <Text className="text-gray-500 text-xs uppercase tracking-wider mt-1">Global Rank</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-nomi-dark-bg">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1">

                {/* Header */}
                <View className="flex-row justify-between items-center py-2 px-4 h-16">
                    {/* Close Button */}
                    <TouchableOpacity onPress={() => router.back()}>
                        <X size={28} color="white" />
                    </TouchableOpacity>

                    {/* Settings Button */}
                    <TouchableOpacity onPress={() => router.push('/settings')}>
                        <Settings size={26} color="white" />
                    </TouchableOpacity>
                </View>

                {showAnalytics && <AnalyticsOverlay />}

                <ScrollView showsVerticalScrollIndicator={false} className="px-4">
                    <Text className="text-3xl font-bold text-white mb-6">Profile</Text>

                    {/* Account Secured Graphic */}
                    <View className="items-center mb-8 mt-4">
                        <View className="w-24 h-24 bg-blue-500/20 rounded-full items-center justify-center mb-4">
                            <Globe size={48} color="#3B82F6" />
                        </View>

                        <View className="flex-row items-center gap-2 mb-2">
                            <ShieldCheck size={16} color="#10B981" />
                            <Text className="text-[#10B981] font-bold text-sm">Anonymous ID</Text>
                        </View>

                        <Text className="text-white text-2xl font-bold tracking-wider mb-2">NOMI_CA41AE52</Text>
                        <Text className="text-gray-400 text-sm">Your identity is protected and hidden</Text>
                    </View>

                    {/* Manage Account Button */}
                    <TouchableOpacity
                        onPress={() => router.push('/profile/manage')}
                        className="w-full border border-gray-600 rounded-full py-3 items-center mb-6 active:bg-gray-800"
                    >
                        <Text className="text-white font-medium text-base">Manage Account</Text>
                    </TouchableOpacity>

                    {/* My Activity Section */}
                    <SectionHeader title="My Activity" />
                    <View className="pt-2">
                        <MenuItem
                            title="My Votes"
                            onPress={() => router.push('/profile/my-votes')}
                        />
                        <MenuItem
                            title="Analytics & Insights"
                            onPress={() => setShowAnalytics(true)}
                        />
                    </View>

                    {/* NOMI for Businesses */}
                    <SectionHeader title="Professional" />
                    <View className="pt-2">
                        <TouchableOpacity
                            className="flex-row justify-between items-center py-4 px-0"
                            onPress={() => router.push('/business-center')}
                        >
                            <View>
                                <Text className="text-white text-base font-medium">NOMI for Businesses</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">Partner with NOMI for education & data</Text>
                            </View>
                            <ChevronRight size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View className="my-4" />

                    {/* Promotions Section */}
                    <SectionHeader title="Promotions" />
                    <View className="pt-2">
                        <MenuItem title="Invite friends to NOMI" onPress={() => router.push('/coming-soon')} />
                        <MenuItem title="Payments & Rewards" onPress={() => router.push('/coming-soon')} />
                    </View>

                    <View className="h-20" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
