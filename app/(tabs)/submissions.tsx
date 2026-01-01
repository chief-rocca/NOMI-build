import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Check, ClipboardList, Flag, Globe, MapPin, Plus, Search, UserCircle, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Animated, {
    Extrapolation,
    FadeIn,
    FadeOut,
    ZoomIn,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Emoji Chips Data
const EMOJI_CHIPS = [
    { category: 'Food & Drink', label: 'Pizza', emoji: '🍕' },
    { category: 'Food & Drink', label: 'Sushi', emoji: '🍣' },
    { category: 'Food & Drink', label: 'Cooking', emoji: '🍳' },
    { category: 'Food & Drink', label: 'Baking', emoji: '🧁' },
    { category: 'Food & Drink', label: 'Cocktails', emoji: '🍹' },
    { category: 'Food & Drink', label: 'Street Food', emoji: '🌮' },
    { category: 'Food & Drink', label: 'Tea', emoji: '🍵' },
    { category: 'Lifestyle & Wellness', label: 'Yoga', emoji: '🧘' },
    { category: 'Lifestyle & Wellness', label: 'Running', emoji: '🏃' },
    { category: 'Lifestyle & Wellness', label: 'Self-care', emoji: '🧖' },
    { category: 'Lifestyle & Wellness', label: 'Interior Design', emoji: '🏠' },
    { category: 'Lifestyle & Wellness', label: 'Mindfulness', emoji: '🕯️' },
    { category: 'Lifestyle & Wellness', label: 'Fashion', emoji: '👗' },
    { category: 'Lifestyle & Wellness', label: 'Beauty', emoji: '💄' },
    { category: 'Hobbies & Entertainment', label: 'Gaming', emoji: '🎮' },
    { category: 'Hobbies & Entertainment', label: 'Photography', emoji: '📸' },
    { category: 'Hobbies & Entertainment', label: 'Reading', emoji: '📚' },
    { category: 'Hobbies & Entertainment', label: 'Movies', emoji: '🎬' },
    { category: 'Hobbies & Entertainment', label: 'Karaoke', emoji: '🎤' },
    { category: 'Hobbies & Entertainment', label: 'Puzzles', emoji: '🧩' },
    { category: 'Hobbies & Entertainment', label: 'Knitting', emoji: '🧶' },
    { category: 'Outdoor & Adventure', label: 'Hiking', emoji: '🏔️' },
    { category: 'Outdoor & Adventure', label: 'Camping', emoji: '⛺' },
    { category: 'Outdoor & Adventure', label: 'Beach days', emoji: '🏖️' },
    { category: 'Outdoor & Adventure', label: 'Cycling', emoji: '🚲' },
    { category: 'Outdoor & Adventure', label: 'Stargazing', emoji: '🌌' },
    { category: 'Outdoor & Adventure', label: 'Kayaking', emoji: '🛶' },
    { category: 'Outdoor & Adventure', label: 'Skiing', emoji: '⛷️' },
    { category: 'Tech & Career', label: 'Coding', emoji: '💻' },
    { category: 'Tech & Career', label: 'Startups', emoji: '🚀' },
    { category: 'Tech & Career', label: 'Marketing', emoji: '📊' },
    { category: 'Tech & Career', label: 'AI', emoji: '🤖' },
    { category: 'Tech & Career', label: 'Design', emoji: '🎨' },
    { category: 'Tech & Career', label: 'Investing', emoji: '📈' },
    { category: 'Values & Community', label: 'Sustainability', emoji: '🌍' },
    { category: 'Values & Community', label: 'Animal Welfare', emoji: '🐾' },
    { category: 'Values & Community', label: 'LGBTQ+', emoji: '🏳️‍🌈' },
    { category: 'Values & Community', label: 'Mental Health', emoji: '🧠' },
    { category: 'Values & Community', label: 'Volunteering', emoji: '🤝' },
];

export default function SubmissionsScreen() {
    const router = useRouter();
    // State
    const [region, setRegion] = useState<'Global' | 'National' | 'Local'>('Global');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopic, setSelectedTopic] = useState<{ label: string; emoji: string } | null>(null);
    const [question, setQuestion] = useState('');
    const [pollType, setPollType] = useState<'binary' | 'multi'>('binary');
    const [options, setOptions] = useState<string[]>(['', '']);
    const [submitted, setSubmitted] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);

    // Scroll Animation Logic
    const scrollY = useSharedValue(0);
    const lastScrollY = useSharedValue(0);
    const buttonTranslateY = useSharedValue(0);
    const headerHeight = 60;

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const currentY = event.contentOffset.y;
            const diff = currentY - lastScrollY.value;

            // Header/Button Logic
            // If scrolling down (diff > 0) and moved more than 10 units -> Hide (Translate down)
            if (currentY <= 0) {
                buttonTranslateY.value = withTiming(0, { duration: 300 });
            } else if (diff > 10) {
                buttonTranslateY.value = withTiming(100, { duration: 300 }); // Hide
            } else if (diff < -10) {
                buttonTranslateY.value = withTiming(0, { duration: 300 }); // Show
            }

            scrollY.value = currentY;
            lastScrollY.value = currentY;
        },
    });

    const headerStyle = useAnimatedStyle(() => {
        return {
            height: interpolate(scrollY.value, [0, headerHeight], [headerHeight, 0], Extrapolation.CLAMP),
            opacity: interpolate(scrollY.value, [0, headerHeight / 2], [1, 0], Extrapolation.CLAMP),
            overflow: 'hidden',
        };
    });

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: buttonTranslateY.value }],
            opacity: interpolate(buttonTranslateY.value, [0, 100], [1, 0], Extrapolation.CLAMP)
        };
    });


    // Filter Logic
    const filteredChips = useMemo(() => {
        if (!searchQuery) return EMOJI_CHIPS;
        return EMOJI_CHIPS.filter(chip =>
            chip.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    // Handlers
    const handleTopicSearch = (text: string) => {
        setSearchQuery(text);
        if (selectedTopic) setSelectedTopic(null); // Deselect on search change if desired
        setShowComingSoon(false);
    };

    const handleTopicSelect = (topic: typeof EMOJI_CHIPS[0]) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedTopic(topic);
        setSearchQuery('');
        Keyboard.dismiss();
    };

    const handleSearchSubmit = () => {
        // If query exists but no exact match selected, or list is empty
        const exactMatch = EMOJI_CHIPS.find(c => c.label.toLowerCase() === searchQuery.toLowerCase());

        if (exactMatch) {
            handleTopicSelect(exactMatch);
        } else if (searchQuery.trim().length > 0) {
            // Trigger "Coming Soon" & Auto-select random
            setShowComingSoon(true);
            const randomTopic = EMOJI_CHIPS[Math.floor(Math.random() * EMOJI_CHIPS.length)];
            setTimeout(() => {
                handleTopicSelect(randomTopic);
            }, 800); // Small delay to let user see "Coming Soon"
        }
    };

    const handleAddOption = () => {
        if (options.length < 10) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setOptions([...options, '']);
        }
    };

    const handleUpdateOption = (text: string, index: number) => {
        const newOptions = [...options];
        newOptions[index] = text;
        setOptions(newOptions);
    };

    const handleRemoveOption = (index: number) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleSubmit = () => {
        Keyboard.dismiss();
        setSubmitted(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        setTimeout(() => {
            setSubmitted(false);
            setSearchQuery('');
            setSelectedTopic(null);
            setQuestion('');
            setPollType('binary');
            setOptions(['', '']);
            setShowComingSoon(false);
        }, 3000);
    };

    const RegionPill = ({ label, icon: Icon }: { label: 'Global' | 'National' | 'Local', icon: any }) => (
        <TouchableOpacity
            onPress={() => setRegion(label)}
            className={`px-5 py-3 rounded-full border mr-3 flex-row items-center gap-2 ${region === label
                ? 'bg-nomi-dark-primary border-nomi-dark-primary'
                : 'bg-nomi-dark-surface border-gray-700'
                }`}
        >
            <Icon size={16} color={region === label ? '#000' : '#A0A0A0'} />
            <Text className={`text-base font-satoshi-medium ${region === label ? 'text-black' : 'text-gray-400'}`}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    if (submitted) {
        return (
            <View className="flex-1 bg-nomi-dark-bg justify-center items-center px-8">
                <StatusBar barStyle="light-content" />
                <Animated.View entering={ZoomIn.duration(500)} className="items-center">
                    <View className="w-24 h-24 bg-green-500/20 rounded-full items-center justify-center mb-6 border border-green-500/50">
                        <Check size={48} color="#10B981" />
                    </View>
                    <Text className="text-white text-3xl font-bold mb-2 text-center">Poll Submitted</Text>
                    <Text className="text-gray-400 text-center text-lg">
                        Your poll has been sent for verification.
                    </Text>
                </Animated.View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-nomi-dark-bg">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Unified Header */}
                <Animated.View style={headerStyle}>
                    <View className="flex-row justify-between items-center px-4 h-full">
                        <TouchableOpacity onPress={() => router.push('/profile')}>
                            <UserCircle size={32} color="#EAEAEA" />
                        </TouchableOpacity>

                        <View className="items-center">
                            <Text className="text-xs text-nomi-dark-subtext uppercase tracking-widest font-satoshi-light">SUBMISSIONS</Text>
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

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className="flex-1">

                            <Animated.ScrollView
                                className="flex-1 px-6"
                                showsVerticalScrollIndicator={false}
                                onScroll={scrollHandler}
                                scrollEventThrottle={16}
                            >

                                {/* Region Selector */}
                                <View className="flex-row mb-6 mt-2">
                                    <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <RegionPill label="Global" icon={Globe} />
                                        <RegionPill label="National" icon={Flag} />
                                        <RegionPill label="Local" icon={MapPin} />
                                    </Animated.ScrollView>
                                </View>

                                {/* Topic Section */}
                                <Text className="text-white text-lg font-bold mb-3">Topic</Text>
                                <View className="bg-nomi-dark-surface rounded-xl px-4 py-3 border border-gray-700 mb-4 flex-row items-center">
                                    <Search size={20} color="#666" />
                                    <TextInput
                                        className="flex-1 ml-3 text-white text-base font-satoshi-medium"
                                        placeholder="Search topics..."
                                        placeholderTextColor="#666"
                                        value={searchQuery}
                                        onChangeText={handleTopicSearch}
                                        onSubmitEditing={handleSearchSubmit}
                                        returnKeyType="search"
                                    />
                                </View>

                                {showComingSoon && (
                                    <Animated.View entering={FadeIn} exiting={FadeOut} className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                        <Text className="text-yellow-500 text-center font-satoshi-medium">
                                            Coming soon! Auto-selecting a popular topic for you...
                                        </Text>
                                    </Animated.View>
                                )}

                                {/* Emoji Chips */}
                                {!selectedTopic ? (
                                    <View className="flex-row flex-wrap gap-2 mb-8">
                                        {filteredChips.length > 0 ? (
                                            filteredChips.slice(0, 15).map((chip, index) => (
                                                <TouchableOpacity
                                                    key={`${chip.label}-${index}`}
                                                    onPress={() => handleTopicSelect(chip)}
                                                    className="bg-gray-800 rounded-full px-4 py-2 border border-gray-700"
                                                >
                                                    <Text className="text-white font-satoshi-medium">{chip.emoji} {chip.label}</Text>
                                                </TouchableOpacity>
                                            ))
                                        ) : (
                                            <Text className="text-gray-500 italic ml-1">Traffic is high on that highway...</Text>
                                        )}
                                        {filteredChips.length > 15 && (
                                            <View className="justify-center px-2">
                                                <Text className="text-gray-600 text-xs">+{filteredChips.length - 15} more</Text>
                                            </View>
                                        )}
                                    </View>
                                ) : (
                                    <View className="flex-row items-center mb-8">
                                        <TouchableOpacity
                                            onPress={() => setSelectedTopic(null)}
                                            className="bg-nomi-dark-primary rounded-full px-4 py-2 flex-row items-center gap-2"
                                        >
                                            <Text className="text-black font-satoshi-bold">{selectedTopic.emoji} {selectedTopic.label}</Text>
                                            <X size={14} color="#000" />
                                        </TouchableOpacity>
                                    </View>
                                )}


                                {/* Prompt Section */}
                                <View className="flex-row justify-between items-end mb-3">
                                    <Text className="text-white text-lg font-bold">The Prompt</Text>
                                    <Text className={`text-xs ${question.length > 140 ? 'text-red-500' : 'text-gray-500'}`}>
                                        {question.length}/150
                                    </Text>
                                </View>
                                <View className="bg-nomi-dark-surface rounded-xl p-4 border border-gray-700 mb-6 h-32">
                                    <TextInput
                                        className="flex-1 text-white text-base font-satoshi-medium leading-6"
                                        placeholder="What's on your mind?"
                                        placeholderTextColor="#666"
                                        multiline
                                        maxLength={150}
                                        value={question}
                                        onChangeText={setQuestion}
                                        style={{ textAlignVertical: 'top' }}
                                    />
                                </View>

                                {/* Format Section */}
                                <Text className="text-white text-lg font-bold mb-3">Format</Text>
                                <View className="flex-row gap-4 mb-6">
                                    <TouchableOpacity
                                        onPress={() => {
                                            setPollType('binary');
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        }}
                                        className={`flex-1 py-4 rounded-xl items-center border ${pollType === 'binary'
                                            ? 'bg-nomi-dark-primary border-nomi-dark-primary'
                                            : 'bg-nomi-dark-surface border-gray-700'
                                            }`}
                                    >
                                        <Text className={`font-bold text-lg ${pollType === 'binary' ? 'text-black' : 'text-gray-500'}`}>
                                            Binary
                                        </Text>
                                        <Text className={`${pollType === 'binary' ? 'text-gray-900' : 'text-gray-600'} text-xs mt-1`}>Yes / No</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            setPollType('multi');
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        }}
                                        className={`flex-1 py-4 rounded-xl items-center border ${pollType === 'multi'
                                            ? 'bg-nomi-dark-primary border-nomi-dark-primary'
                                            : 'bg-nomi-dark-surface border-gray-700'
                                            }`}
                                    >
                                        <Text className={`font-bold text-lg ${pollType === 'multi' ? 'text-black' : 'text-gray-500'}`}>
                                            Multi
                                        </Text>
                                        <Text className={`${pollType === 'multi' ? 'text-gray-900' : 'text-gray-600'} text-xs mt-1`}>Choices</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Multi-Choice Options */}
                                {pollType === 'multi' && (
                                    <Animated.View entering={FadeIn} exiting={FadeOut} className="mb-6">
                                        <Text className="text-white text-lg font-bold mb-3">Options</Text>
                                        {options.map((option, index) => (
                                            <View key={index} className="flex-row items-center mb-3">
                                                <TextInput
                                                    className="flex-1 bg-nomi-dark-surface text-white p-4 rounded-xl border border-gray-700 mr-2"
                                                    placeholder={`Option ${index + 1}`}
                                                    placeholderTextColor="#666"
                                                    value={option}
                                                    onChangeText={(text) => handleUpdateOption(text, index)}
                                                />
                                                {options.length > 2 && (
                                                    <TouchableOpacity
                                                        onPress={() => handleRemoveOption(index)}
                                                        className="p-3 bg-nomi-dark-surface rounded-full border border-gray-700"
                                                    >
                                                        <X size={20} color="#EF4444" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        ))}

                                        {options.length < 10 && (
                                            <TouchableOpacity
                                                onPress={handleAddOption}
                                                className="flex-row items-center justify-center py-3 border border-dashed border-gray-600 rounded-xl mt-2 active:bg-gray-800"
                                            >
                                                <Plus size={20} color="#9CA3AF" />
                                                <Text className="text-gray-400 font-medium ml-2">Add Option</Text>
                                            </TouchableOpacity>
                                        )}
                                    </Animated.View>
                                )}

                                <View className="h-32" />
                            </Animated.ScrollView>

                            {/* Sticky Submit Button with Scroll Animation */}
                            <Animated.View
                                className="absolute bottom-4 left-6 right-6"
                                style={buttonAnimatedStyle}
                            >
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={!selectedTopic || !question || (pollType === 'multi' && options.some(o => !o))}
                                    className={`py-4 rounded-full items-center shadow-lg flex-row justify-center gap-2 ${!selectedTopic || !question || (pollType === 'multi' && options.some(o => !o))
                                        ? 'bg-gray-800 opacity-80'
                                        : 'bg-nomi-dark-primary'
                                        }`}
                                >
                                    <ClipboardList size={20} color={!selectedTopic || !question ? '#666' : '#000'} />
                                    <Text className={`font-bold text-lg ${!selectedTopic || !question ? 'text-gray-500' : 'text-black'}`}>
                                        Submit Poll
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>

                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
