import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { Delete } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface NumpadProps {
    onPress: (key: string) => void;
    onDelete: () => void;
}

export const Numpad = ({ onPress, onDelete }: NumpadProps) => {
    // Group keys into rows for consistent grid layout
    const rows = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['', '0', 'del'] // Empty string is a spacer
    ];

    const handlePress = (key: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (key === 'del') {
            onDelete();
        } else if (key !== '') {
            onPress(key);
        }
    };

    return (
        <View className="w-full max-w-[340px] mx-auto px-4">
            {rows.map((row, rowIndex) => (
                <View key={rowIndex} className="flex-row justify-between mb-6">
                    {row.map((key, colIndex) => {
                        if (key === '') {
                            // Spacer
                            return <View key={`${rowIndex}-${colIndex}`} className="w-20 h-20" />;
                        }

                        const isDelete = key === 'del';

                        return (
                            <TouchableOpacity
                                key={key}
                                onPress={() => handlePress(key)}
                                className={clsx(
                                    "w-20 h-20 rounded-full justify-center items-center",
                                    isDelete ? "bg-transparent" : "bg-gray-800 active:bg-gray-700"
                                )}
                            >
                                {isDelete ? (
                                    <Delete size={28} color="#EAEAEA" />
                                ) : (
                                    <Text className="text-3xl font-satoshi-bold text-white">{key}</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ))}
        </View>
    );
};
