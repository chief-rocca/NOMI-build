import { useRouter } from 'expo-router';
import { Gift, ScrollText, UserCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeablePollCard } from '../../src/components/SwipeablePollCard';
import { sponsoredBinaryPolls, sponsoredPollsData } from '../../src/data/sponsoredPolls';
// Import Images
const IMG_1 = require('../../assets/images/2025-02-21-inv-wiesbaden-map-promos-threeByTwoMediumAt2X-v9.webp');
const IMG_2 = require('../../assets/images/30edsall-mlvj-videoLarge.webp');
const IMG_3 = require('../../assets/images/30int-israel-ngo01-photo-qbcw-threeByTwoMediumAt2X.webp');

const POLL_IMAGES = [IMG_1, IMG_2, IMG_3];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function SponsoredScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'Questionnaires' | 'Rewards'>('Questionnaires');

    // Header Animation Logic
    const scrollY = useSharedValue(0);
    const headerHeight = 60;

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const headerStyle = useAnimatedStyle(() => {
        return {
            height: interpolate(scrollY.value, [0, headerHeight], [headerHeight, 0], Extrapolation.CLAMP),
            opacity: interpolate(scrollY.value, [0, headerHeight / 2], [1, 0], Extrapolation.CLAMP),
            overflow: 'hidden',
        };
    });

    const TabPill = ({ label, icon: Icon }: { label: 'Questionnaires' | 'Rewards', icon: any }) => (
        <TouchableOpacity
            onPress={() => setActiveTab(label)}
            className={`px-5 py-3 rounded-full border mr-3 flex-row items-center gap-2 ${activeTab === label
                ? 'bg-nomi-dark-primary border-nomi-dark-primary'
                : 'bg-nomi-dark-surface border-gray-700'
                }`}
        >
            <Icon size={16} color={activeTab === label ? '#000' : '#A0A0A0'} />
            <Text className={`text-base font-satoshi-medium ${activeTab === label ? 'text-black' : 'text-gray-400'}`}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    // Combine and shuffle data
    const combinedPolls = React.useMemo(() => {
        const polls = [...sponsoredPollsData, ...sponsoredBinaryPolls];
        // Fisher-Yates shuffle to randomize feed
        for (let i = polls.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [polls[i], polls[j]] = [polls[j], polls[i]];
        }
        return polls;
    }, []);

    return (
        <View className="flex-1 bg-nomi-dark-bg">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Collapsible Header */}
                <Animated.View style={headerStyle}>
                    <View className="flex-row justify-between items-center px-4 h-full">
                        <TouchableOpacity onPress={() => router.push('/profile')}>
                            <UserCircle size={32} color="#EAEAEA" />
                        </TouchableOpacity>

                        <View className="items-center">
                            <Text className="text-xs text-nomi-dark-subtext uppercase tracking-widest font-satoshi-light">SPONSORED</Text>
                            <Text className="text-2xl text-nomi-dark-text font-satoshi-bold">NOMI</Text>
                        </View>

                        <TouchableOpacity onPress={() => router.push('/stats/globe' as any)}>
                            <Image
                                source={require('../../assets/images/earth_globe.png')}
                                style={{ width: 28, height: 28, borderRadius: 14 }}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Tabs */}
                <View className="py-2 h-16 mb-2">
                    <View className="flex-row px-6">
                        <TabPill label="Questionnaires" icon={ScrollText} />
                        <TabPill label="Rewards" icon={Gift} />
                    </View>
                </View>

                {/* Content */}
                {activeTab === 'Questionnaires' ? (
                    <AnimatedFlatList
                        data={combinedPolls}
                        keyExtractor={(item: any, index: number) => `sponsored-combo-${index}`}
                        renderItem={({ item, index }: { item: any, index: number }) => (
                            <View className="px-6 mb-2">
                                <SwipeablePollCard
                                    poll={{
                                        ...item,
                                        id: `sponsored-${index}`,
                                        votes: Math.floor(Math.random() * 5000),
                                        timeRemaining: '2 Days Left',
                                        status: 'pending',
                                        variant: 'sponsored', // Apply Fancy/Sponsored Variant
                                        insight: item.insight || 'General',
                                        insightColor: item.insightColor || 'blue',
                                        // Ensure options exists even for binary if required by types (though they won't be used for binary rendering logic ideally)
                                        // The SwipeablePollCard logic handles 'binary' type correctly by ignoring options array.
                                        image: POLL_IMAGES[index % POLL_IMAGES.length], // Cyclic images
                                        type: (item as any).type || 'binary' // Explicit fallback/cast
                                    }}
                                    onSwipeLeft={() => { }}
                                    onSwipeRight={() => { }}
                                />
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                    />
                ) : (
                    <View className="flex-1 justify-center items-center px-8">
                        <View className="w-24 h-24 bg-yellow-500/20 rounded-full items-center justify-center mb-6">
                            <Gift size={48} color="#EAB308" />
                        </View>
                        <Text className="text-white text-3xl font-bold mb-4">Rewards</Text>
                        <Text className="text-gray-400 text-center text-base px-2 leading-6">
                            <Text className="text-white font-bold">Polls with Perks:</Text> Your feedback helps shape the future—and puts rewards in your pocket.
                            {'\n\n'}
                            <Text className="text-white font-bold">Everyday Savings:</Text> From deep discounts to cash back, we make sure your loyalty pays off.
                            {'\n\n'}
                            <Text className="text-white font-bold">Earn as You Go:</Text> Participate in quick polls and watch your balance grow.
                        </Text>
                    </View>
                )}

            </SafeAreaView>
        </View>
    );
}
