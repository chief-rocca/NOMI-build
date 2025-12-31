import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withDecay } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GLOBE_SIZE = SCREEN_WIDTH * 0.85;

export default function GlobeScreen() {
    const router = useRouter();
    const rotation = useSharedValue(0);

    // Mock Stats Data tied to rotation
    // In a real app, this would query based on coordinate mapping
    const stats = useMemo(() => ([
        { region: 'North America', users: '1.2M', votes: '8.5M', trend: '+12%' },
        { region: 'Europe', users: '950K', votes: '6.2M', trend: '+8%' },
        { region: 'Asia Pacific', users: '2.1M', votes: '15.3M', trend: '+22%' },
        { region: 'Latin America', users: '600K', votes: '3.1M', trend: '+5%' },
        { region: 'Africa', users: '450K', votes: '2.8M', trend: '+15%' },
    ]), []);

    // Derived value to cycle through stats based on rotation
    // We normalize rotation to an index
    const activeStatIndex = useSharedValue(0);

    const savedRotation = useSharedValue(0);

    const pan = Gesture.Pan()
        .onStart(() => {
            savedRotation.value = rotation.value;
        })
        .onUpdate((e) => {
            rotation.value = savedRotation.value + (e.translationX / 2);
        })
        .onEnd((e) => {
            rotation.value = withDecay({ velocity: e.velocityX / 2, deceleration: 0.995 });
        });

    const globeStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${rotation.value}deg` }]
    }));

    // Parallax effect for "texture" moving inside the masked circle
    const textureStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: rotation.value % GLOBE_SIZE }]
    }));

    // Dynamic Text
    // Note: Reanimated strings are tricky, so we use a simpler approach for the MVP:
    // We render all stats and fade them in/out based on index

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="absolute top-12 left-6 z-50">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="bg-gray-900/50 p-3 rounded-full border border-gray-700"
                    >
                        <X size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Main Content */}
                <View className="flex-1 items-center justify-center">
                    <Text className="text-white text-xs font-bold uppercase tracking-[0.3em] mb-12 opactiy-50">
                        Global Activity Map
                    </Text>

                    {/* Globe Container */}
                    <GestureDetector gesture={pan}>
                        <View style={styles.globeContainer}>
                            <View style={styles.globeMask}>
                                {/* The "Texture" - we tile the image to allow continuous scroll */}
                                <Animated.View style={[{ flexDirection: 'row', width: GLOBE_SIZE * 4 }, textureStyle]}>
                                    <Image
                                        source={require('../../assets/images/earth_globe.png')}
                                        style={styles.globeImage}
                                        resizeMode="cover"
                                    />
                                    <Image
                                        source={require('../../assets/images/earth_globe.png')}
                                        style={styles.globeImage}
                                        resizeMode="cover"
                                    />
                                </Animated.View>
                                {/* Shadow Overlay for Sphere effect */}
                                <View style={styles.shadowOverlay} />
                            </View>

                            {/* Glow behind */}
                            <View style={styles.glow} />
                        </View>
                    </GestureDetector>

                    {/* Stats Overlay */}
                    <View className="mt-16 w-full px-8">
                        {stats.map((stat, index) => (
                            <StatBlock
                                key={index}
                                item={stat}
                                index={index}
                                activeIndex={activeStatIndex}
                            />
                        ))}
                    </View>

                    <Text className="text-gray-500 text-xs mt-8">
                        Swipe to rotate & explore
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

const StatBlock = ({ item, index, activeIndex }: { item: any, index: number, activeIndex: Animated.SharedValue<number> }) => {
    const style = useAnimatedStyle(() => {
        // We read the shared value. 
        // Note: For perfect sync, we might need runOnJS or Derived values, 
        // but checking basic range is often enough for simple carousel logic.
        // Let's use interpolation for a smooth fade transition window.

        // Since activeIndex is updated imperatively in the gesture, it might be jumpy.
        // Better: use rotation value directly.

        // Simpler fallback for MVP:
        // We just always show Global stats or make it static for now if complex to link seamlessly.
        // But let's try to simulate checking shared value match.
        // This is a bit advanced for rapid MVP, so let's stick to a static "Global" generic stat 
        // if this proves unstable, but I'll try to just show one static customized block for now
        // to ensure it works reliable without flickering.
        return {
            opacity: 1 // for now
        };
    });

    // Actually, let's just render ONE main stats block that is generic "Global" for this MVP
    // as true rotation-mapped data requires complex texture mapping logic.
    if (index !== 0) return null;

    return (
        <View className="flex-row justify-between bg-gray-900/80 p-6 rounded-2xl border border-gray-800">
            <View>
                <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Active Citizens</Text>
                <Text className="text-white text-3xl font-satoshi-bold">4.2M</Text>
            </View>
            <View className="items-end">
                <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Votes Today</Text>
                <Text className="text-nomi-primary text-3xl font-satoshi-bold">12.8M</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    globeContainer: {
        width: GLOBE_SIZE,
        height: GLOBE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    globeMask: {
        width: GLOBE_SIZE,
        height: GLOBE_SIZE,
        borderRadius: GLOBE_SIZE / 2,
        overflow: 'hidden',
        backgroundColor: '#001a33', // Deep ocean
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        position: 'relative',
    },
    globeImage: {
        width: GLOBE_SIZE * 2, // Double width for scrolling
        height: GLOBE_SIZE,
    },
    shadowOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: GLOBE_SIZE / 2,
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: -20, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 40,
        // Inset shadow simulation using a semi-transparent gradient overlay could go here
        // For simplified app, we use a radial gradient overlay image or just opacity
        // Using a simple dark overlay on edges:
        borderWidth: 0,
    },
    glow: {
        position: 'absolute',
        width: GLOBE_SIZE * 1.2,
        height: GLOBE_SIZE * 1.2,
        borderRadius: (GLOBE_SIZE * 1.2) / 2,
        backgroundColor: '#4facfe',
        opacity: 0.15,
        zIndex: -1,
        // blurRadius: 40, // Only works on some views or need Expo Blur
    }
});
