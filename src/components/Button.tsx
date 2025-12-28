import { clsx } from 'clsx';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
    onPress?: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'white';
    shape?: 'rounded' | 'squircle';
    isLoading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    className?: string; // Allow extra styling
}

export const Button = ({
    onPress,
    title,
    variant = 'primary',
    shape = 'rounded',
    isLoading = false,
    disabled = false,
    icon,
    className
}: ButtonProps) => {

    const baseStyles = "h-14 flex-row items-center justify-center px-6";

    // Shape variants
    const shapeStyles = {
        rounded: "rounded-full",
        squircle: "rounded-2xl"
    };

    const variants = {
        primary: "bg-nomi-primary",
        secondary: "bg-gray-500",
        outline: "border-2 border-gray-300 bg-transparent",
        white: "bg-white",
    };

    const textVariants = {
        primary: "text-white font-bold text-lg",
        secondary: "text-white font-bold text-lg",
        outline: "text-gray-700 font-bold text-lg",
        white: "text-gray-800 font-bold text-lg",
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isLoading || disabled}
            className={clsx(
                baseStyles,
                shapeStyles[shape],
                variants[variant],
                (disabled) && "opacity-50",
                className
            )}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'white' ? 'black' : 'white'} />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text className={clsx(textVariants[variant], icon && "ml-3")}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};
