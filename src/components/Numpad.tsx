import { FontAwesome5 } from '@expo/vector-icons';
import { clsx } from 'clsx';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface NumpadProps {
    onPress: (key: string) => void;
    onDelete: () => void;
}

export const Numpad = ({ onPress, onDelete }: NumpadProps) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

    return (
        <View className="flex-row flex-wrap justify-between w-full px-10">
            {keys.map((key, index) => {
                if (key === '') return <View key={index} className="w-20 h-20" />; // Spacer

                return (
                    <TouchableOpacity
                        key={key}
                        onPress={() => key === 'del' ? onDelete() : onPress(key)}
                        className={clsx(
                            "w-20 h-20 rounded-full justify-center items-center mb-6",
                            key === 'del' ? "bg-white/30" : "bg-white/30"
                        )}
                    >
                        {key === 'del' ? (
                            <FontAwesome5 name="backspace" size={24} color="#333" />
                        ) : (
                            <Text className="text-3xl font-semibold text-gray-800">{key}</Text>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
