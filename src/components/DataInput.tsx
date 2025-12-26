import { clsx } from 'clsx';
import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface DataInputProps extends TextInputProps {
    label?: string;
    error?: string;
    className?: string;
}

export const DataInput = ({ label, error, className, ...props }: DataInputProps) => {
    return (
        <View className={clsx("w-full mb-4", className)}>
            {label && <Text className="mb-2 text-gray-700 font-medium">{label}</Text>}
            <TextInput
                className="w-full bg-gray-50 h-14 rounded-xl px-4 border border-gray-200 text-lg"
                placeholderTextColor="#9ca3af"
                {...props}
            />
            {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
        </View>
    );
};
