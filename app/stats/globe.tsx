import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import React, { useMemo, useRef } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { GLOBE_HTML } from '../../src/constants/globeHtml';

export default function GlobeScreen() {
    const router = useRouter();
    const webViewRef = useRef<WebView>(null);

    // Mock Heatmap Data (approx. centers for demo)
    const heatmapData = useMemo(() => ([
        // South Africa (High Density)
        { lat: -26.2041, lng: 28.0473, weight: 1.5 }, { lat: -26.1, lng: 28.1, weight: 1.2 }, { lat: -26.3, lng: 28.0, weight: 1.3 },
        { lat: -33.9249, lng: 18.4241, weight: 1.2 }, { lat: -34.0, lng: 18.5, weight: 1.0 }, { lat: -33.8, lng: 18.4, weight: 0.9 },
        { lat: -29.8587, lng: 31.0218, weight: 0.8 }, // Durban

        // USA (East Coast)
        { lat: 40.7128, lng: -74.0060, weight: 1.0 }, { lat: 40.8, lng: -74.1, weight: 0.8 }, { lat: 40.6, lng: -73.9, weight: 0.9 },
        { lat: 38.9072, lng: -77.0369, weight: 0.7 }, // DC
        { lat: 42.3601, lng: -71.0589, weight: 0.6 }, // Boston

        // USA (West Coast)
        { lat: 34.0522, lng: -118.2437, weight: 0.9 }, { lat: 37.7749, lng: -122.4194, weight: 0.8 },

        // Europe
        { lat: 51.5074, lng: -0.1278, weight: 0.8 }, { lat: 51.4, lng: -0.1, weight: 0.6 }, // London
        { lat: 48.8566, lng: 2.3522, weight: 0.7 }, // Paris
        { lat: 52.5200, lng: 13.4050, weight: 0.6 }, // Berlin
        { lat: 41.9028, lng: 12.4964, weight: 0.5 }, // Rome

        // Asia
        { lat: 35.6762, lng: 139.6503, weight: 0.9 }, // Tokyo
        { lat: 37.5665, lng: 126.9780, weight: 0.7 }, // Seoul
        { lat: 1.3521, lng: 103.8198, weight: 0.8 }, // Singapore

        // Mobile / South America
        { lat: -23.5505, lng: -46.6333, weight: 0.7 }, // Sao Paulo
        { lat: -34.6037, lng: -58.3816, weight: 0.6 }, // Buenos Aires

        // Oceania
        { lat: -33.8688, lng: 151.2093, weight: 0.7 }, // Sydney
    ]), []);

    // Data injection now handled in onLoadEnd

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header Overlay */}
                <View className="absolute top-12 left-6 z-50">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="bg-gray-900/50 p-3 rounded-full border border-gray-700"
                    >
                        <X size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Title Overlay */}
                <View className="absolute top-16 w-full items-center z-40 pointer-events-none">
                    <Text className="text-white text-xs font-bold uppercase tracking-[0.3em] opacity-80">
                        Global Vote Heatmap
                    </Text>
                </View>

                {/* WebView Container */}
                <View className="flex-1 rounded-3xl overflow-hidden my-4 mx-2 border border-gray-900">
                    <WebView
                        ref={webViewRef}
                        originWhitelist={['*']}
                        source={{ html: GLOBE_HTML, baseUrl: '' }}
                        style={{ flex: 1, backgroundColor: 'black' }}
                        scrollEnabled={false}
                        onLoadEnd={() => {
                            const script = `if (window.updateGlobeData) { window.updateGlobeData(${JSON.stringify(heatmapData)}); } else { console.error("updateGlobeData missing"); } true;`;
                            webViewRef.current?.injectJavaScript(script);
                        }}
                        onMessage={(event) => {
                            try {
                                const data = JSON.parse(event.nativeEvent.data);
                                if (data.type === 'CONSOLE') {
                                    console.log(`[WebView \${data.logType}]:`, ...data.args);
                                }
                            } catch (e) {
                                // console.log('WebView Message:', event.nativeEvent.data);
                            }
                        }}
                    />
                </View>

                {/* Stats Overlay Logic can remain mocked or removed if heatmap is self-explanatory */}
                <View className="absolute bottom-12 left-6 right-6">
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
                </View>
            </SafeAreaView>
        </View>
    );
}
