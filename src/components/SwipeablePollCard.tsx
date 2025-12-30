import { Check, Clock, MapPin, MoreHorizontal, Share2, ThumbsUp, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Extrapolation, FadeIn, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

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
    type?: 'binary' | 'multi'; // New field
    options?: string[];        // New field
    variant?: 'default' | 'sponsored';
}

interface Props {
    poll: PollData;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
}

const OPTION_COLORS = [
    '#FFA000', // A: Orange
    '#6CB4EE', // B: Blue
    '#00D2BE', // C: Mint Green
    '#FFD200', // D: Sunflower Yellow
    '#A06EE1', // E: Purple
];

const OptionRow = ({
    pollId,
    index,
    option,
    isSelected,
    hasVoted,
    percentage,
    color,
    onSelect
}: {
    pollId: string;
    index: number;
    option: string;
    isSelected: boolean;
    hasVoted: boolean;
    percentage: number;
    color: string;
    onSelect: () => void;
}) => {
    // Shared value for width animation (0 to percentage)
    const width = useSharedValue(0);

    React.useEffect(() => {
        if (hasVoted) {
            width.value = withSpring(percentage, { damping: 15, stiffness: 90 });
        }
    }, [hasVoted, percentage]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${width.value}%`,
        };
    });

    // "Light" background for the track: 
    // Mix the color with white to get a pastel version.
    // Simple Approximation: Rgb + White overlay with low opacity
    // Or we can just use a static light grey for the track if the user wants "Light instead of Dark".
    // "Light" usually implies brightness. 
    // Let's use a very light opacity of the color mixed with white.
    // But since we are on dark background, "Light" might just mean white with low opacity.
    // Let's try: `backgroundColor: 'rgba(255,255,255,0.1)'` mixed with a tiny bit of color.

    // Hex to RGB
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }
    const rgb = hexToRgb(color);
    // Track color: We want it "Light". 
    // Let's try `rgba(r,g,b,0.2)` but add a white background to it? No.
    // Let's just make it a light grey with a tint.
    const lightTrackColor = `rgba(${Math.min(rgb.r + 50, 255)}, ${Math.min(rgb.g + 50, 255)}, ${Math.min(rgb.b + 50, 255)}, 0.15)`;


    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onSelect}
            disabled={hasVoted}
            className="flex-row items-center relative overflow-hidden rounded-xl h-16 mb-3"
            style={{
                backgroundColor: hasVoted ? lightTrackColor : '#2A2A2A',
                // If not voted, small shadow. If voted, flat.
                shadowColor: !hasVoted && isSelected ? color : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: !hasVoted && isSelected ? 0.3 : 0.1,
                shadowRadius: 4,
                elevation: !hasVoted && isSelected ? 4 : 1,
                borderWidth: hasVoted ? 0 : (isSelected ? 1 : 0),
                borderColor: isSelected ? color : 'transparent'
            }}
        >
            {/* Proportional Fill Bar (Animated) */}
            {hasVoted && (
                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            backgroundColor: color,
                        },
                        animatedStyle
                    ]}
                />
            )}

            {/* Content Payload */}
            <View className="flex-1 flex-row items-center px-4" style={{ zIndex: 10 }}>
                <View
                    style={{
                        backgroundColor: hasVoted ? 'rgba(0,0,0,0.2)' : (isSelected ? color : '#3A3A3A'),
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                    }}
                >
                    <Text className={`font-satoshi-bold text-lg ${hasVoted ? 'text-white' : (isSelected ? 'text-white' : 'text-gray-400')}`}>
                        {String.fromCharCode(65 + index)}
                    </Text>
                </View>

                <Text className={`flex-1 font-satoshi-medium text-base text-white`}
                    numberOfLines={2}
                    style={{
                        // Text Shadow for readability on any background
                        textShadowColor: 'rgba(0,0,0,0.6)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 3
                    }}>
                    {option}
                </Text>

                {hasVoted && (
                    <Animated.Text entering={FadeIn.delay(300)} className="font-satoshi-bold text-lg text-white ml-2"
                        style={{ textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
                        {percentage}%
                    </Animated.Text>
                )}

                {!hasVoted && isSelected && (
                    <View className="bg-white/20 p-1 rounded-full">
                        <Check size={16} color="white" strokeWidth={3} />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const MultiChoiceView = ({ poll }: { poll: PollData }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // Generate accurate random percentages that sum to 100
    const percentages = React.useMemo(() => {
        if (!poll.options) return [];
        const count = poll.options.length;
        if (count === 0) return [];

        let remaining = 100;
        const percs = [];

        for (let i = 0; i < count - 1; i++) {
            const max = remaining - ((count - 1 - i) * 5);
            // Clamp ensures we don't get stuck
            const val = Math.max(5, Math.floor(Math.random() * (max - 5 + 1)) + 5);
            percs.push(val);
            remaining -= val;
        }
        percs.push(remaining);

        return percs.sort(() => Math.random() - 0.5);
    }, [poll.id, poll.options]);

    const handleSelect = (index: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(index);
    }

    return (
        <View style={[
            styles.card,
            poll.variant === 'sponsored' && {
                backgroundColor: '#1a1a1a',
                borderWidth: 1,
                borderColor: '#FFD700', // Gold border
                shadowColor: '#FFD700',
                shadowOpacity: 0.3,
                shadowRadius: 10
            }
        ]}>
            {/* Header Row: Insight/Badge + Menu */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                    <View className="flex-row items-center px-2 py-1 bg-gray-800 rounded-md shadow-sm">
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#A06EE1', marginRight: 6 }} />
                        <Text className="text-gray-300 text-xs font-satoshi-medium uppercase tracking-wider">Multi Poll</Text>
                    </View>
                    {poll.variant === 'sponsored' && (
                        <View className="bg-yellow-500/20 px-2 py-1 rounded-md border border-yellow-500/50">
                            <Text className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">Sponsored</Text>
                        </View>
                    )}
                    {poll.location && (
                        <View className="flex-row items-center gap-1">
                            <MapPin size={12} color="#6b7280" />
                            <Text className="text-gray-500 text-xs font-satoshi-medium">{poll.location}</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity className="p-1">
                    <MoreHorizontal size={20} color="#6b7280" />
                </TouchableOpacity>
            </View>

            <Text className="text-2xl text-nomi-dark-text font-satoshi-medium leading-8 mb-6">
                {poll.question}
            </Text>

            <View className="mb-2">
                {poll.options?.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const hasVoted = selectedOption !== null;
                    const color = OPTION_COLORS[index % OPTION_COLORS.length];
                    const percentage = percentages[index] || 0;

                    return (
                        <OptionRow
                            key={index}
                            pollId={poll.id}
                            index={index}
                            option={option}
                            isSelected={isSelected}
                            hasVoted={hasVoted}
                            percentage={percentage}
                            color={color}
                            onSelect={() => handleSelect(index)}
                        />
                    );
                })}
            </View>

            {/* Bottom Actions/Stats */}
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

                <TouchableOpacity>
                    <Share2 size={20} color="#6b7280" />
                </TouchableOpacity>
            </View>
        </View>
    );
}


export const SwipeablePollCard = ({ poll, onSwipeLeft, onSwipeRight }: Props) => {
    // If it's a multi-choice poll, render the static view (no swiping)
    if (poll.type === 'multi') {
        return (
            <View style={styles.container}>
                <MultiChoiceView poll={poll} />
            </View>
        );
    }

    const translateX = useSharedValue(0);

    const pan = Gesture.Pan()
        .activeOffsetX([-20, 20])
        .failOffsetY([-20, 20])
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
                        poll.variant === 'sponsored' && {
                            backgroundColor: '#1a1a1a',
                            borderWidth: 1,
                            borderColor: '#FFD700', // Gold border
                            shadowColor: '#FFD700',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.5,
                            shadowRadius: 15,
                            elevation: 10
                        }
                    ]}
                >
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

                    {/* Card Content */}
                    <View>
                        {/* Header Row: Insight/Badge + Menu */}
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
                                {poll.location && (
                                    <View className="flex-row items-center gap-1">
                                        <MapPin size={12} color="#6b7280" />
                                        <Text className="text-gray-500 text-xs font-satoshi-medium">{poll.location}</Text>
                                    </View>
                                )}
                            </View>

                            <TouchableOpacity className="p-1">
                                <MoreHorizontal size={20} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Question */}
                        <Text className="text-2xl text-nomi-dark-text font-satoshi-medium leading-8 mb-6">
                            {poll.question}
                        </Text>

                        {/* Status Indicator / CTA */}
                        {poll.status === 'pending' && (
                            <View className="mb-4 flex-row items-center gap-2 bg-nomi-dark-surface/50 self-start px-3 py-1.5 rounded-full border border-gray-700/50">
                                <View className="w-2 h-2 rounded-full bg-nomi-dark-primary animate-pulse" />
                                <Text className="text-nomi-dark-primary text-xs font-satoshi-bold">Waiting for your vote</Text>
                            </View>
                        )}

                        {/* Fake Progress/Context Bar */}
                        <View className="w-full h-2 bg-gray-800 rounded-full overflow-hidden flex-row mb-6">
                            <View className="flex-1 bg-nomi-dark-primary opacity-20" />
                        </View>

                        {/* Bottom Actions/Stats */}
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

                            <TouchableOpacity>
                                <Share2 size={20} color="#6b7280" />
                            </TouchableOpacity>
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
