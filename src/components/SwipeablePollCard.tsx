import { Check, ChevronsRight, Clock, MoreHorizontal, ThumbsUp, X } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, Extrapolation, FadeIn, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export interface PollData {
    id: string;
    question: string;
    category: string;
    votes: number;
    timeRemaining: string;
    insight: string;
    insightColor: string;
    location?: string;
    status?: 'pending' | 'voted' | 'skipped';
    type?: 'binary' | 'multi';
    options?: string[];
    variant?: 'default' | 'sponsored';
    image?: any; // Image source (require or uri)
}

interface Props {
    poll: PollData;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
}

// Ranked Colors: 1st Blue, 2nd Orange, 3rd Mint, 4th Yellow
const RANK_COLORS = [
    '#6CB4EE', // 1st: Blue
    '#FFA000', // 2nd: Orange
    '#00D2BE', // 3rd: Mint Green
    '#FFD200', // 4th: Sunflower Yellow
];

const OptionRow = ({
    index,
    option,
    isSelected,
    hasVoted,
    percentage,
    rank,
    onVote
}: {
    index: number;
    option: string;
    isSelected: boolean;
    hasVoted: boolean;
    percentage: number;
    rank: number;
    onVote: () => void;
}) => {
    // Shared value for swipe translation
    const translateX = useSharedValue(0);
    const width = useSharedValue(0);

    // Determine Color based on Rank
    const color = RANK_COLORS[rank] || '#A06EE1'; // Fallback purple

    useEffect(() => {
        if (hasVoted) {
            // Animate only if mounted fresh, or instant if pre-voted check
            width.value = withSpring(percentage, { damping: 15, stiffness: 90 });
        }
    }, [hasVoted, percentage]);

    const pan = Gesture.Pan()
        .activeOffsetX(20) // Only activate on horizontal swipe right
        .failOffsetX(-20) // Fail on swipe left
        .enabled(!hasVoted) // Disable gesture if already voted
        .onUpdate((event) => {
            if (event.translationX > 0) {
                translateX.value = event.translationX;
            }
        })
        .onEnd(() => {
            if (translateX.value > 100) { // Threshold to trigger vote
                runOnJS(onVote)();
                translateX.value = withSpring(0);
            } else {
                translateX.value = withSpring(0);
            }
        });

    const animatedSwipeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    const animatedFillStyle = useAnimatedStyle(() => ({
        width: `${width.value}%`,
    }));

    // "White Beam" Border Effect
    // If selected, we show a white border with a glow (shadow).
    const borderStyle = isSelected ? {
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10, // Android glow
    } : {
        borderWidth: 0,
        borderColor: 'transparent'
    };

    return (
        <GestureDetector gesture={pan}>
            <View className="mb-3 relative">
                {/* Background Layer (Swipe Track) */}
                {!hasVoted && (
                    <View className="absolute inset-0 bg-gray-800 rounded-xl overflow-hidden justify-center pl-4">
                        <Animated.View style={{ opacity: interpolate(translateX.value, [0, 100], [0, 1], Extrapolation.CLAMP) }}>
                            <Text className="text-nomi-dark-primary font-bold text-sm tracking-widest">SLIDE TO VOTE</Text>
                        </Animated.View>
                    </View>
                )}

                <Animated.View
                    className="flex-row items-center relative overflow-hidden rounded-xl h-16 bg-[#2A2A2A]"
                    style={[
                        animatedSwipeStyle,
                        isSelected && borderStyle,
                        // Dim others if voted
                        hasVoted && !isSelected && { opacity: 0.5 }
                    ]}
                >
                    {/* Fill Bar */}
                    {hasVoted && (
                        <Animated.View
                            style={[
                                {
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    backgroundColor: color,
                                    opacity: 0.8
                                },
                                animatedFillStyle
                            ]}
                        />
                    )}

                    {/* Content */}
                    <View className="flex-1 flex-row items-center px-4 z-10">
                        <View
                            style={{
                                backgroundColor: hasVoted ? 'rgba(0,0,0,0.3)' : (isSelected ? color : '#3A3A3A'),
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 12,
                            }}
                        >
                            <Text className={`font-satoshi-bold text-lg text-white`}>
                                {String.fromCharCode(65 + index)}
                            </Text>
                        </View>

                        <Text className="flex-1 font-satoshi-medium text-base text-white shadow-sm" numberOfLines={2}>
                            {option}
                        </Text>

                        {!hasVoted && (
                            <ChevronsRight size={20} color="#666" style={{ opacity: 0.5 }} />
                        )}

                        {hasVoted && (
                            <Animated.Text entering={FadeIn.delay(300)} className="font-satoshi-bold text-lg text-white ml-2 shadow-sm">
                                {percentage}%
                            </Animated.Text>
                        )}
                    </View>
                </Animated.View>
            </View>
        </GestureDetector>
    );
};

const MultiChoiceView = ({ poll, onVoteComplete }: { poll: PollData, onVoteComplete?: () => void }) => {
    // If poll.status is 'voted', we initialize differently
    const isPreVoted = poll.status === 'voted';

    // We can randomize a selection for visual demo if it's pre-voted
    const [selectedOption, setSelectedOption] = useState<number | null>(isPreVoted ? Math.floor(Math.random() * (poll.options?.length || 2)) : null);
    const [stats, setStats] = useState<{ percentage: number; rank: number }[]>([]);

    useEffect(() => {
        if (isPreVoted) {
            // Generate stats immediately without animation delay if possible
            // Logic repeated from handleVote but auto-triggered
            generateStats(selectedOption || 0);
        }
    }, [isPreVoted]);

    const generateStats = (idx: number) => {
        // 1. Generate random percentages
        const count = poll.options?.length || 0;
        let remaining = 100;
        const percs = [];
        for (let i = 0; i < count - 1; i++) {
            const val = Math.max(5, Math.floor(Math.random() * (remaining / (count - i) * 1.5)));
            percs.push(val);
            remaining -= val;
        }
        percs.push(remaining);

        const withIndices = percs.map((p, i) => ({ percentage: p, originalIndex: i }));
        const sorted = [...withIndices].sort((a, b) => b.percentage - a.percentage);

        const mappedStats = new Array(count);
        withIndices.forEach((item, originalIdx) => {
            const rank = sorted.findIndex(s => s.originalIndex === originalIdx);
            mappedStats[originalIdx] = { percentage: item.percentage, rank };
        });

        setStats(mappedStats);
    }

    // Generate stats only once upon voting
    const handleVote = (index: number) => {
        if (selectedOption !== null) return;
        generateStats(index);
        setSelectedOption(index);
        if (onVoteComplete) onVoteComplete();
    };

    return (
        <View style={[
            styles.card,
            poll.variant === 'sponsored' && styles.sponsoredCard
        ]}>
            {/* Image Header */}
            {poll.image && (
                <View className="w-full h-32 mb-4 rounded-xl overflow-hidden">
                    <Image source={poll.image} className="w-full h-full" resizeMode="cover" />
                </View>
            )}

            {/* Header / Meta */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                    {/* Badge removed as requested */}
                </View>
                <MoreHorizontal size={20} color="#6b7280" />
            </View>

            <Text className="text-2xl text-nomi-dark-text font-satoshi-medium leading-8 mb-6">
                {poll.question}
            </Text>

            <View className="mb-2">
                {poll.options?.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const hasVoted = selectedOption !== null;
                    const stat = stats[index] || { percentage: 0, rank: 0 };

                    return (
                        <OptionRow
                            key={index}
                            index={index}
                            option={option}
                            isSelected={isSelected}
                            hasVoted={hasVoted}
                            percentage={stat.percentage}
                            rank={stat.rank}
                            onVote={() => handleVote(index)}
                        />
                    );
                })}
            </View>

            <View className="flex-row justify-between items-center border-t border-gray-800 pt-4 mt-2">
                <View className="flex-row items-center gap-4">
                    <Text className="text-gray-400 text-sm font-satoshi-medium">{poll.votes.toLocaleString()} Votes</Text>
                    <Text className="text-gray-400 text-sm font-satoshi-medium">{poll.timeRemaining}</Text>
                </View>
            </View>
        </View>
    );
};


export const SwipeablePollCard = ({ poll, onSwipeLeft, onSwipeRight }: Props) => {
    // Shared opacity for Fade Out
    const containerOpacity = useSharedValue(1);

    const handleVoteComplete = () => {
        // Only fade out if it's a NEW vote (status pending).
        // If viewing history (status voted), logic might differ, but for now we follow the general rule unless overridden.
        if (poll.status === 'pending') {
            containerOpacity.value = withDelay(3500, withTiming(0, { duration: 500, easing: Easing.inOut(Easing.quad) }));
        }
    };

    // Style for the container to handle the fade out
    const containerStyle = useAnimatedStyle(() => ({
        opacity: containerOpacity.value,
        display: containerOpacity.value === 0 ? 'none' : 'flex'
    }));

    // If it's a multi-choice poll
    if (poll.type === 'multi') {
        return (
            <Animated.View style={[styles.container, containerStyle]}>
                <MultiChoiceView poll={poll} onVoteComplete={handleVoteComplete} />
            </Animated.View>
        );
    }

    // Binary Poll Logic
    const translateX = useSharedValue(0);
    const isVoted = poll.status === 'voted';

    // Randomized Binary Stats for "Voted" view if data missing
    // In a real app, this would come from backend.
    const binaryStats = useMemo(() => {
        const ag = Math.floor(Math.random() * 60) + 20; // Random % for Agree
        return { agree: ag, disagree: 100 - ag };
    }, []);

    const pan = Gesture.Pan()
        .activeOffsetX([-20, 20])
        .failOffsetY([-20, 20])
        .enabled(!isVoted) // Lock interaction if voted
        .onChange((event) => {
            translateX.value = event.translationX;
        })
        .onEnd(() => {
            if (translateX.value > SWIPE_THRESHOLD) {
                translateX.value = withSpring(SCREEN_WIDTH * 1.5);
                runOnJS(onSwipeRight)();
            } else if (translateX.value < -SWIPE_THRESHOLD) {
                translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
                runOnJS(onSwipeLeft)();
            } else {
                translateX.value = withSpring(0);
            }
        });

    const cardStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { rotate: `${interpolate(translateX.value, [-SCREEN_WIDTH, 0, SCREEN_WIDTH], [-15, 0, 15])}deg` },
            ],
        };
    });

    const likeOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, SCREEN_WIDTH / 4], [0, 1], Extrapolation.CLAMP),
    }));

    const nopeOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [-SCREEN_WIDTH / 4, 0], [1, 0], Extrapolation.CLAMP),
    }));

    // Map insight color name to actual hex
    const getInsightColor = (color: string) => {
        switch (color) {
            case 'red': return '#EF4444';
            case 'orange': return '#F59E0B';
            case 'green': return '#10B981';
            default: return '#3B82F6';
        }
    }

    return (
        <View style={styles.container}>
            <GestureDetector gesture={pan}>
                <Animated.View
                    style={[
                        styles.card,
                        cardStyle,
                        poll.variant === 'sponsored' && styles.sponsoredCard
                    ]}
                >
                    {/* Binary Result Overlay (If Voted) */}
                    {isVoted && (
                        <View className="absolute inset-0 z-50 rounded-3xl overflow-hidden justify-center">
                            {/* Darken background slightly */}
                            <View className="absolute inset-0 bg-black/60" />

                            {/* Results Bar Container */}
                            <View className="mx-6">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-white font-bold text-lg">AGREE</Text>
                                    <Text className="text-white font-bold text-lg">DISAGREE</Text>
                                </View>

                                {/* The Bar */}
                                <View className="h-4 w-full flex-row rounded-full overflow-hidden">
                                    <View
                                        style={{
                                            flex: binaryStats.agree,
                                            backgroundColor: binaryStats.agree >= binaryStats.disagree ? '#FFA000' : '#6CB4EE'
                                        }}
                                    />
                                    <View
                                        style={{
                                            flex: binaryStats.disagree,
                                            backgroundColor: binaryStats.disagree > binaryStats.agree ? '#FFA000' : '#6CB4EE'
                                        }}
                                    />
                                </View>

                                <View className="flex-row justify-between mt-2">
                                    <Text className="text-white font-bold text-2xl">{binaryStats.agree}%</Text>
                                    <Text className="text-white font-bold text-2xl">{binaryStats.disagree}%</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {!isVoted && (
                        <View style={{ pointerEvents: 'none', zIndex: 100, ...StyleSheet.absoluteFillObject }}>
                            {/* Overlay for Agree (Right Swipe) */}
                            <Animated.View style={[styles.overlay, styles.likeOverlay, likeOpacity]}>
                                <Check size={80} color="white" />
                                <Text style={styles.overlayText}>AGREE</Text>
                            </Animated.View>

                            {/* Overlay for Disagree (Left Swipe) */}
                            <Animated.View style={[styles.overlay, styles.nopeOverlay, nopeOpacity]}>
                                <X size={80} color="white" />
                                <Text style={styles.overlayText}>DISAGREE</Text>
                            </Animated.View>
                        </View>
                    )}

                    {/* Card Content */}
                    <View>
                        {/* Image Header */}
                        {poll.image && (
                            <View className="w-full h-40 mb-4 rounded-2xl overflow-hidden shadow-sm">
                                <Image source={poll.image} className="w-full h-full" resizeMode="cover" />
                            </View>
                        )}

                        {/* Meta Row */}
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center gap-2">
                                <View className="flex-row items-center px-2 py-1 bg-gray-800 rounded-md shadow-sm">
                                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: getInsightColor(poll.insightColor), marginRight: 6 }} />
                                    <Text className="text-gray-300 text-xs font-satoshi-medium uppercase tracking-wider">{poll.insight}</Text>
                                </View>
                                {poll.variant === 'sponsored' && (
                                    <View className="bg-yellow-500/20 px-2 py-1 rounded-md border border-yellow-500/50">
                                        <Text className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">Sponsored</Text>
                                    </View>
                                )}
                            </View>
                            <MoreHorizontal size={20} color="#6b7280" />
                        </View>

                        {/* Question */}
                        <Text className="text-2xl text-nomi-dark-text font-satoshi-medium leading-8 mb-6">
                            {poll.question}
                        </Text>

                        {/* Stats */}
                        <View className="flex-row justify-between items-center border-t border-gray-800 pt-4">
                            <View className="flex-row items-center gap-4">
                                <View className="flex-row items-center gap-1.5">
                                    <ThumbsUp size={14} color="#A0A0A0" />
                                    <Text className="text-gray-400 text-sm font-satoshi-medium">{poll.votes.toLocaleString()} Votes</Text>
                                </View>
                                <View className="flex-row items-center gap-1.5">
                                    <Clock size={14} color="#A0A0A0" />
                                    <Text className="text-gray-400 text-sm font-satoshi-medium">{poll.timeRemaining}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
    },
    card: {
        width: '100%',
        backgroundColor: '#1E1E1E',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sponsoredCard: {
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#FFD700', // Gold border
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    likeOverlay: {
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // Green
    },
    nopeOverlay: {
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // Red
    },
    overlayText: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Satoshi-Bold',
        marginTop: 10,
    }
});
