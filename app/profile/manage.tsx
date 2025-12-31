import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Mail, MapPin, User } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ManageAccountScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-nomi-dark-bg">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1">

                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-3">
                    <TouchableOpacity onPress={() => router.back()} className="p-2">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-bold">Manage Account</Text>
                    <View className="w-10" />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="px-6 pt-4">

                    {/* Profile Picture Placeholder */}
                    <View className="items-center mb-8">
                        <View className="w-24 h-24 bg-gray-800 rounded-full items-center justify-center mb-3 border border-gray-700">
                            <User size={40} color="#666" />
                        </View>
                        <Text className="text-nomi-dark-primary font-bold">Edit Photo</Text>
                    </View>

                    {/* Fields */}
                    <View className="gap-6">
                        <View>
                            <Text className="text-gray-400 text-sm mb-2 font-medium ml-1">Display Name</Text>
                            <View className="flex-row items-center bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                                <User size={18} color="#666" />
                                <TextInput
                                    className="flex-1 text-white ml-3 text-base"
                                    value="NOMI Citizen"
                                    editable={false}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-gray-400 text-sm mb-2 font-medium ml-1">Email</Text>
                            <View className="flex-row items-center bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                                <Mail size={18} color="#666" />
                                <TextInput
                                    className="flex-1 text-white ml-3 text-base"
                                    value="citizen@nomi.app"
                                    editable={false}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-gray-400 text-sm mb-2 font-medium ml-1">Location</Text>
                            <View className="flex-row items-center bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                                <MapPin size={18} color="#666" />
                                <TextInput
                                    className="flex-1 text-white ml-3 text-base"
                                    value="Global"
                                    editable={false}
                                />
                            </View>
                        </View>

                        {/* Demographics Area */}
                        <View className="mt-4 pt-6 border-t border-gray-800">
                            <Text className="text-white font-bold text-lg mb-4">Demographics</Text>
                            <Text className="text-gray-500 text-sm mb-6 leading-5">
                                Your demographic data helps us ensure balanced polling results. This information is kept private and never shared directly.
                            </Text>

                            <View className="gap-4">
                                <View className="flex-row justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800">
                                    <View className="flex-row items-center gap-3">
                                        <Lock size={20} color="#A0A0A0" />
                                        <View>
                                            <Text className="text-white font-medium">Password</Text>
                                            <Text className="text-gray-500 text-xs mt-0.5">Last changed 30d ago</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity>
                                        <Text className="text-nomi-dark-primary font-bold text-sm">Reset</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    </View>

                    <TouchableOpacity className="mt-12 mb-6 items-center">
                        <Text className="text-gray-500 font-bold text-base uppercase tracking-wider">Deactivate Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="mb-20 items-center">
                        <Text className="text-red-900/60 font-bold text-sm">Delete Account</Text>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
