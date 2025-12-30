import { useRouter } from 'expo-router';
import { ChevronLeft, Lock, Mail, MapPin, Phone, Power } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function ManageAccountScreen() {
    const router = useRouter();

    const InfoRow = ({ label, value, icon: Icon, onEdit }: { label: string, value: string, icon: any, onEdit?: () => void }) => (
        <View className="mb-6 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <View className="flex-row items-center mb-2">
                <Icon size={16} color="#9CA3AF" />
                <Text className="text-gray-400 text-sm ml-2 font-medium">{label}</Text>
            </View>
            <View className="flex-row justify-between items-center">
                <Text className="text-white text-lg font-satoshi-medium">{value}</Text>
                {onEdit && (
                    <TouchableOpacity onPress={onEdit}>
                        <Text className="text-nomi-primary font-bold text-sm">Change</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-nomi-dark-bg">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ChevronLeft size={28} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Manage Account</Text>
                </View>

                <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>

                    <View className="mb-8">
                        <Text className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-satoshi-bold">User Identity</Text>
                    </View>

                    <InfoRow
                        label="Phone Number"
                        value="+1 (555) 019-2834"
                        icon={Phone}
                        onEdit={() => console.log('Edit Phone')}
                    />

                    <InfoRow
                        label="Email Address"
                        value="junii@nomi.com"
                        icon={Mail}
                        onEdit={() => console.log('Edit Email')}
                    />

                    <InfoRow
                        label="Region Verification"
                        value="United States"
                        icon={MapPin}
                        onEdit={() => console.log('Edit Region')}
                    />

                    <TouchableOpacity className="mt-8 mb-4 border border-gray-700 bg-gray-800 py-4 rounded-xl flex-row justify-center items-center gap-2">
                        <Lock size={18} color="white" />
                        <Text className="text-white font-bold">Password Management</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="mb-4 border border-yellow-900/50 bg-yellow-900/10 py-4 rounded-xl flex-row justify-center items-center gap-2">
                        <Power size={18} color="#EAB308" />
                        <Text className="text-yellow-500 font-bold">Deactivate Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="border border-red-900/50 bg-red-900/10 py-4 rounded-xl items-center">
                        <Text className="text-red-500 font-bold">Delete Account</Text>
                    </TouchableOpacity>

                    <View className="items-center mt-10">
                        <Text className="text-gray-600 text-xs">NOMI Identity Protection Active</Text>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
