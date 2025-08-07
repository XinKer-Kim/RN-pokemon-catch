// /app/(tabs)/profile.tsx

import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold">프로필</Text>
      <Text className="mt-2 text-gray-500">(준비 중인 기능입니다)</Text>
    </SafeAreaView>
  );
}
