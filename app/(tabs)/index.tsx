import { PollData, SwipeablePollCard } from '@/components/SwipeablePollCard';
import { useRouter } from 'expo-router';
import { Flag, Globe, MapPin, UserCircle } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, LayoutAnimation, RefreshControl, Image as RNImage, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { multiPollsData } from '../../src/data/multipolls';
import rawPolls from '../../src/data/polls.json';
// Import Images
const IMG_1 = require('../../assets/images/2025-02-21-inv-wiesbaden-map-promos-threeByTwoMediumAt2X-v9.webp');
const IMG_2 = require('../../assets/images/30edsall-mlvj-videoLarge.webp');
const IMG_3 = require('../../assets/images/30int-israel-ngo01-photo-qbcw-threeByTwoMediumAt2X.webp');

const POLL_IMAGES = [IMG_1, IMG_2, IMG_3];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<'Global' | 'National' | 'Local' | 'Multi' | null>(null);
  const [allPolls, setAllPolls] = useState<PollData[]>([]);
  const [displayedPolls, setDisplayedPolls] = useState<PollData[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 25;
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

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  // Helper to generate random metadata
  const generateMetadata = (category: string) => {
    const locations = {
      Global: ['Earth', 'International', 'Online', 'Worldwide'],
      National: ['New York, USA', 'London, UK', 'Tokyo, JP', 'Berlin, DE', 'Paris, FR'],
      Local: ['Brooklyn, NY', 'Shoreditch, LDN', 'Shibuya, JP', 'Kreuzberg, DE', 'Le Marais, FR']
    }
    const statuses: ('pending' | 'voted' | 'skipped')[] = ['pending']; // Always pending for Home feed

    let locationList = locations.Global;
    if (category === 'National') locationList = locations.National;
    if (category === 'Local') locationList = locations.Local;

    return {
      location: locationList[Math.floor(Math.random() * locationList.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      // Random Image
      image: POLL_IMAGES[Math.floor(Math.random() * POLL_IMAGES.length)]
    }
  }

  // Initialize and Shuffle Polls
  const initPolls = useCallback(() => {
    const generatedPolls: PollData[] = [];
    const insights = ['Trending', 'Hot Topic', 'Controversial', 'New', 'Closing Soon'];
    const colors = ['red', 'orange', 'green', 'blue'];

    const pollsData = Array.isArray(rawPolls) ? rawPolls : [];

    // Binary Polls
    pollsData.forEach((category: any) => {
      if (category.polls) {
        category.polls.forEach((question: string, index: number) => {
          const metadata = generateMetadata(category.category);
          generatedPolls.push({
            id: `${category.category}-${index}-${Math.random()}`,
            question,
            category: category.category,
            votes: Math.floor(Math.random() * 49500) + 500,
            timeRemaining: `${Math.floor(Math.random() * 46) + 2}h remaining`,
            insight: insights[Math.floor(Math.random() * insights.length)],
            insightColor: colors[Math.floor(Math.random() * colors.length)],
            location: metadata.location,
            status: metadata.status,
            type: 'binary',
            image: metadata.image
          });
        });
      }
    });

    // Multi Polls
    multiPollsData.forEach((poll: any, index: number) => {
      const metadata = generateMetadata(poll.category);
      generatedPolls.push({
        id: `multi-${index}-${Math.random()}`,
        question: poll.question,
        category: poll.category,
        votes: Math.floor(Math.random() * 30000) + 1000,
        timeRemaining: `${Math.floor(Math.random() * 20) + 2}h remaining`,
        insight: 'Multiple Choice',
        insightColor: 'purple',
        location: metadata.location,
        status: 'pending',
        type: 'multi',
        image: metadata.image,
        options: poll.options
      });
    });

    // Shuffle
    return generatedPolls.sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    const polls = initPolls();
    setAllPolls(polls);
  }, [initPolls]);


  // Optimization: Memoize filtered results to avoid recalculating on every render
  const filteredPolls = useMemo(() => {
    if (!activeFilter) return allPolls;
    if (activeFilter === 'Multi') return allPolls.filter(p => p.type === 'multi');
    return allPolls.filter(p => p.category === activeFilter);
  }, [allPolls, activeFilter]);

  // Update displayed polls based on filter/pagination
  useEffect(() => {
    setDisplayedPolls(filteredPolls.slice(0, page * ITEMS_PER_PAGE));
    setHasMore(displayedPolls.length < filteredPolls.length);
  }, [filteredPolls, page]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [activeFilter]);


  // Load More logic
  const loadMore = () => {
    if (!hasMore) return;
    setPage(prev => prev + 1);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate network delay
    setTimeout(() => {
      const newPolls = initPolls();
      setAllPolls(newPolls);
      setPage(1);
      setRefreshing(false);
    }, 1000);
  }, [initPolls]);


  // Handle Swipe (Remove card from stack)
  const handleSwipe = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDisplayedPolls(current => current.filter(p => p.id !== id));
    // Also remove from master list if desired, but for visual stack this is enough
  };


  const FilterPill = ({ label, icon: Icon }: { label: 'Global' | 'National' | 'Local' | 'Multi', icon: any }) => (
    <TouchableOpacity
      onPress={() => setActiveFilter(activeFilter === label ? null : label)}
      className={`px-5 py-3 rounded-full border mr-3 flex-row items-center gap-2 ${activeFilter === label
        ? 'bg-nomi-dark-primary border-nomi-dark-primary'
        : 'bg-nomi-dark-surface border-gray-700'
        }`}
    >
      <Icon size={16} color={activeFilter === label ? '#000' : '#A0A0A0'} />
      <Text className={`text-base font-satoshi-medium ${activeFilter === label ? 'text-black' : 'text-gray-400'
        }`}>
        {label === 'Multi' ? 'Multi Poll' : label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-nomi-dark-bg" edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Collapsible Header */}
      <Animated.View style={headerStyle}>
        <View className="flex-row items-center justify-between px-4 h-full">
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <UserCircle size={32} color="#EAEAEA" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-xs text-nomi-dark-subtext uppercase tracking-widest font-satoshi-light">{dateString}</Text>
            <Text className="text-2xl text-nomi-dark-text font-satoshi-bold">NOMI</Text>
          </View>

          <TouchableOpacity onPress={() => router.push('/stats/globe')}>
            <RNImage
              source={require('../../assets/images/earth_globe.png')}
              style={{ width: 28, height: 28, borderRadius: 14 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Sticky Filter Container */}
      <View className="px-4 py-4 bg-nomi-dark-bg z-10 border-b border-nomi-dark-bg/0">
        <View className="flex-row">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={['Global', 'National', 'Local']}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              let Icon = Globe;
              if (item === 'National') Icon = Flag;
              if (item === 'Local') Icon = MapPin;
              return <FilterPill label={item as any} icon={Icon} />;
            }}
          />
        </View>
      </View>

      {/* Feed Content */}
      <AnimatedFlatList
        data={displayedPolls}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: { item: any }) => (
          <SwipeablePollCard
            poll={item}
            onSwipeLeft={() => handleSwipe(item.id)}
            onSwipeRight={() => handleSwipe(item.id)}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#fff" />
        }
        ListFooterComponent={hasMore ? <View className="py-4"><ActivityIndicator color="#fff" /></View> : null}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500 font-satoshi-medium">No polls found.</Text>
          </View>
        }
      />
    </SafeAreaView >
  );
}
