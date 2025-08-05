import { Tabs } from "expo-router";
import { Home, User } from "lucide-react-native";
import React from "react";
export default function Tabslayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: "홈", tabBarIcon: () => <Home size={20} /> }}
      />
      <Tabs.Screen name="pokedex" options={{ title: "도감" }} />
      <Tabs.Screen name="dashboard" options={{ title: "대시보드" }} />
      <Tabs.Screen
        name="profile"
        options={{ title: "프로필", tabBarIcon: () => <User size={20} /> }}
      />
    </Tabs>
  );
}
