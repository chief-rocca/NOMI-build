import { Tabs } from 'expo-router';
import { FileText, Megaphone, Newspaper, Scale } from 'lucide-react-native';
import React from 'react';

import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#A0A0A0',
        headerShown: false,
        tabBarStyle: {
          paddingTop: 5,
          backgroundColor: '#121212',
          borderTopColor: '#2A2A2A',
        },
        tabBarLabelStyle: {
          fontFamily: 'Satoshi-Medium',
          fontSize: 10,
          marginTop: 4,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color }) => <Newspaper size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="politics"
        options={{
          title: 'POLITICS',
          tabBarIcon: ({ color }) => <Scale size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sponsored"
        options={{
          title: 'SPONSORED',
          tabBarIcon: ({ color }) => <Megaphone size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="submissions"
        options={{
          title: 'SUBMISSIONS',
          tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
