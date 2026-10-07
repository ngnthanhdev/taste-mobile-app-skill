import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { fontFamily, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function TabsLayout() {
  const c = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.text,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.divider },
        tabBarLabelStyle: { ...type.caption, fontFamily: fontFamily.ui, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="overview"
        options={{ title: 'Tổng quan', tabBarIcon: ({ color }) => <MaterialIcons name="space-dashboard" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="stock"
        options={{ title: 'Kho', tabBarIcon: ({ color }) => <MaterialIcons name="inventory-2" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: 'Lịch sử', tabBarIcon: ({ color }) => <MaterialIcons name="history" size={24} color={color} /> }}
      />
    </Tabs>
  );
}
