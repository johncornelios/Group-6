
import React from "react";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#B91C1C",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          href: null,
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
        }}
      />

      <Tabs.Screen
        name="camera"
        options={{
          title: "Evidence",
        }}
      />

      <Tabs.Screen
        name="location"
        options={{
          title: "Location",
        }}
      />

      <Tabs.Screen
        name="sensor"
        options={{
          title: "Sensors",
        }}
      />
    </Tabs>
  );
}
