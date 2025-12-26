import { Button } from '@/components/Button';
import { DataInput } from '@/components/DataInput';
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/mock/AuthService';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StatusBar, Text, View } from 'react-native';

export default function ModalScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (phoneNumber.length < 5) {
      setError('Please enter a valid phone number');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await AuthService.requestOtp(phoneNumber);
      // Navigate to OTP screen with params
      router.push({
        pathname: '/auth/otp',
        params: { phone: phoneNumber }
      });
    } catch (e: any) {
      setError(e.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-nomi-bg justify-center items-center px-6">
      <StatusBar barStyle="light-content" />

      {/* Background Icon (Visual styling) */}
      <View className="absolute top-20 items-center opacity-80">
        <View className="bg-white/20 p-6 rounded-full mb-6">
          <MaterialCommunityIcons name="shield-check" size={48} color={Colors.light.accent} />
        </View>
      </View>

      {/* Modal Card */}
      <View className="bg-white w-full rounded-3xl p-6 shadow-xl space-y-6">

        {/* Header */}
        <View className="flex-row items-center mb-2">
          <FontAwesome name="google" size={28} color="#DB4437" />
          <Text className="text-2xl font-bold ml-3 text-gray-800">Google Login</Text>
        </View>

        <Text className="text-gray-600 text-base">
          Enter your mobile number for OTP verification:
        </Text>

        {/* Input */}
        <DataInput
          // label="Mobile Number"
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

        {/* Actions */}
        <View className="flex-row space-x-4">
          <View className="flex-1">
            <Button
              title="Cancel"
              variant="secondary"
              className="bg-gray-100"
              // nativewind trick: overwrite bg-gray-500 from variant
              onPress={handleCancel}
            // Need to fix Button text color logic if we override bg
            />
            {/* 
                Correction: My Button component logic for variants is strict. 
                I should just use "white" variant for Cancel or update Button.tsx. 
                For now, let's use a custom variant or style override.
             */}
          </View>
          <View className="flex-1">
            <Button
              title="Send OTP"
              variant="primary"
              isLoading={loading}
              onPress={handleSendOtp}
            />
          </View>
        </View>
      </View>

      {/* Bottom Action */}
      <View className="mt-8 w-full">
        <Button
          title="Use mobile number"
          variant="secondary"
          className="bg-gray-600/50" // Semi-transparent dark
          icon={<FontAwesome name="mobile-phone" size={24} color="#333" />}
          disabled
        />
      </View>
    </View>
  );
}

