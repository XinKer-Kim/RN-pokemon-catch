import { Tabs } from "expo-router";
import {
  BookMarked,
  Crown,
  Home,
  LayoutDashboard,
  User,
} from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 60 },
        tabBarLabelStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => <Home size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pokedex"
        options={{ title: "도감", tabBarIcon: () => <BookMarked size={20} /> }}
      />
      <Tabs.Screen
        name="rank"
        options={{ title: "랭킹", tabBarIcon: () => <Crown size={20} /> }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "대시보드",
          tabBarIcon: () => <LayoutDashboard size={20} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "프로필", tabBarIcon: () => <User size={20} /> }}
      />
    </Tabs>
  );
}
