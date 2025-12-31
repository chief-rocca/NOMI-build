import { useRouter } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, Modal, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PollData, SwipeablePollCard } from '../../src/components/SwipeablePollCard';

// Import Images used in other screens for consistency
const IMG_1 = require('../../assets/images/2025-02-21-inv-wiesbaden-map-promos-threeByTwoMediumAt2X-v9.webp');
const IMG_2 = require('../../assets/images/30edsall-mlvj-videoLarge.webp');
const IMG_3 = require('../../assets/images/30int-israel-ngo01-photo-qbcw-threeByTwoMediumAt2X.webp');

const POLL_IMAGES = [IMG_1, IMG_2, IMG_3];

export default function MyVotesScreen() {
    const router = useRouter();
    const [selectedPoll, setSelectedPoll] = useState<PollData | null>(null);

    // Generate Mock Voted Data
    const votedPolls: PollData[] = React.useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => ({
            id: `voted-${i}`,
            question: i % 2 === 0
                ? "Is remote work actually more productive than office work?"
                : "Should AI be regulated more strictly by governments?",
            category: i % 3 === 0 ? 'Technology' : 'Lifestyle',
            votes: Math.floor(Math.random() * 50000) + 5000,
            timeRemaining: 'Ended',
            insight: 'Completed',
            insightColor: 'gray',
            status: 'voted',
            type: i % 4 === 0 ? 'multi' : 'binary', // Mix types
            image: POLL_IMAGES[i % POLL_IMAGES.length],
            options: i % 4 === 0 ? ['Yes, absolutely', 'No, not at all', 'It depends', 'Unsure'] : undefined
        }));
    }, []);

    const renderItem = ({ item }: { item: PollData }) => (
        <TouchableOpacity
            className="flex-1 m-2 bg-[#1E1E1E] rounded-xl overflow-hidden aspect-[4/5] relative"
            onPress={() => setSelectedPoll(item)}
        >
            <Image source={item.image} className="w-full h-full absolute inset-0 opacity-60" resizeMode="cover" />
            <View className="absolute inset-0 bg-black/40" />

            <View className="flex-1 p-3 justify-between">
                <View className="self-start bg-nomi-primary/80 px-2 py-1 rounded">
                    <Text className="text-white text-[10px] font-bold uppercase">{item.category}</Text>
                </View>

                <View>
                    <Text className="text-white font-satoshi-bold text-sm leading-5 shadow-sm" numberOfLines={3}>
                        {item.question}
                    </Text>
                    <Text className="text-gray-300 text-xs mt-1">{item.votes.toLocaleString()} votes</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-nomi-dark-bg">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header */}
                <View className="flex-row items-center px-4 py-4 mb-2">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold">My Votes</Text>
                </View>

                <FlatList
                    data={votedPolls}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    contentContainerStyle={{ padding: 8 }}
                    showsVerticalScrollIndicator={false}
                />

                {/* Post-Vote Detail Modal */}
                <Modal
                    visible={!!selectedPoll}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setSelectedPoll(null)}
                >
                    <View className="flex-1 bg-black/90 justify-center items-center px-4">
                        <TouchableOpacity
                            className="absolute top-12 right-6 p-2 bg-gray-800 rounded-full z-50"
                            onPress={() => setSelectedPoll(null)}
                        >
                            <X size={24} color="white" />
                        </TouchableOpacity>

                        {selectedPoll && (
                            <View className="w-full py-10">
                                <Text className="text-center text-gray-400 font-satoshi-medium mb-4 uppercase tracking-widest">
                                    You voted on this
                                </Text>
                                <SwipeablePollCard
                                    poll={selectedPoll}
                                    onSwipeLeft={() => { }}
                                    onSwipeRight={() => { }}
                                />
                            </View>
                        )}
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
}
