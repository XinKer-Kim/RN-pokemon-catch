import { AppHeader } from "@/src/components/common";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="w-full h-full">
      <AppHeader />
      <Text className="text-3xl" style={{ fontFamily: "DungGeunMo" }}>
        Gotta Catch &apos;Em All
      </Text>
      <Text style={{ fontFamily: "DungGeunMo", fontSize: 24 }}>
        야생의 포켓몬이(가) 나타났다!
      </Text>
      <View className="w-full flex flex-row flex-wrap gap-5">
        <View className="flex flex-1 h-60 bg-black"></View>
        <View className="flex flex-1 h-60 bg-white"></View>
        <View className="flex flex-1 h-60 bg-blue-50"></View>
        <View className="flex flex-1 h-60 bg-red-50"></View>
      </View>
    </View>
  );
}
