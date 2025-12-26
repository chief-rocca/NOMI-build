import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/useAuthStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

export default function DashboardScreen() {
  const user = useAuthStore(state => state.user);

  // Simple protection: Redirect if no user (Simulates protected route)
  // In a real app we'd handle this more robustly in _layout
  if (!user && !__DEV__) {
    // return <Redirect href="/" />; 
    // Commented out to avoid redirect loops during dev hot-reloads if session clears
  }

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center p-6">
      <View className="bg-white p-8 rounded-2xl shadow-sm items-center w-full">
        <MaterialCommunityIcons name="shield-check" size={64} color={Colors.light.primary} />

        <Text className="text-2xl font-bold text-gray-800 mt-4 mb-2">
          Welcome, {user?.firstName || 'User'}!
        </Text>

        <Text className="text-gray-500 text-center mb-6">
          You have successfully verified your simulated account.
        </Text>

        <View className="bg-blue-50 px-4 py-2 rounded-lg">
          <Text className="text-blue-800 font-mono">
            Session Active
          </Text>
        </View>
      </View>
    </View>
  );
}
