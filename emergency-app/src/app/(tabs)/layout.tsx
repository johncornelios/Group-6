import React from "react";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#B91C1C",
        tabBarInactiveTintColor: "#6B7280",
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarLabel: "Home",
        }}
      />

      <Tabs.Screen
        name={"camera" as any}
        options={{
          title: "Evidence",
          tabBarLabel: "Evidence",
        }}
      />

      <Tabs.Screen
        name="location"
        options={{
          title: "Location",
          tabBarLabel: "Location",
        }}
      />

      <Tabs.Screen
        name="sensor"
        options={{
          title: "Sensors",
          tabBarLabel: "Sensors",
        }}
      />
    </Tabs>
  );
}
