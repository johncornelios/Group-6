
import React from "react";
import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#F8FAFC",
        },
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="location" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="sensor" />
      <Stack.Screen name="records" />
    </Stack>
  );
}
