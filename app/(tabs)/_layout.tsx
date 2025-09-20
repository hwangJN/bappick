import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabLayout() {
  const screenOptions = React.useMemo(
    () => ({
      tabBarActiveTintColor: "#7EA1FF",
      tabBarInactiveTintColor: "#9CA3AF",
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "#F2F6FF",
        borderTopColor: "#E6E8EF",
      },
      tabBarButton: HapticTab,
    }),
    []
  );

  const homeOptions = React.useMemo(
    () => ({
      title: "Home",
      tabBarShowLabel: false,
      tabBarIcon: ({ color }: { color: string }) => (
        <IconSymbol size={28} name="house.fill" color={color} />
      ),
    }),
    []
  );

  const favOptions = React.useMemo(
    () => ({
      title: "Favorites",
      tabBarShowLabel: false,
      tabBarIcon: ({ color }: { color: string }) => (
        <IconSymbol size={28} name="heart.fill" color={color} />
      ),
    }),
    []
  );

  const settingsOptions = React.useMemo(
    () => ({
      title: "Settings",
      tabBarShowLabel: false,
      tabBarIcon: ({ color }: { color: string }) => (
        <IconSymbol size={28} name="gearshape.fill" color={color} />
      ),
    }),
    []
  );

  const manageOptions = React.useMemo(
    () => ({
      href: null,
      title: "Manage",
      tabBarShowLabel: false,
      tabBarIcon: ({ color }: { color: string }) => (
        <IconSymbol size={28} name="list.bullet" color={color} />
      ),
    }),
    []
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={homeOptions} />
      <Tabs.Screen name="favorites" options={favOptions} />
      <Tabs.Screen name="settings" options={settingsOptions} />
      <Tabs.Screen name="manage" options={manageOptions} />
    </Tabs>
  );
}
