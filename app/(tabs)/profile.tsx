// /app/(tabs)/profile.tsx

import { ProfileEditModal } from "@/src/components/modal/ProfileEditModal"; // 수정 모달 import
import { usePokedexStore } from "@/src/store/pokedexStore";
import { useProfileStore } from "@/src/store/profileStore";
import { FontAwesome } from "@expo/vector-icons"; // 아이콘 import
import { useMemo, useState } from "react"; // useState import
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 정보 요약 카드를 위한 컴포넌트
const StatSummaryCard = ({
  title,
  value,
  unit,
}: {
  title: string;
  value: string | number;
  unit?: string;
}) => (
  <View className="bg-gray-50 border border-gray-200 rounded-lg p-3 items-center flex-1">
    <Text className="text-sm text-gray-500">{title}</Text>
    <Text className="text-xl font-bold mt-1">
      {value}
      {unit && <Text className="text-base font-normal">{unit}</Text>}
    </Text>
  </View>
);

export default function ProfileScreen() {
  const { username, avatarId, bio } = useProfileStore();
  const { caughtCounts } = usePokedexStore();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // 모달 표시 여부 상태

  // 가장 많이 잡은 포켓몬을 찾는 로직
  const favoritePokemonId = useMemo(() => {
    if (Object.keys(caughtCounts).length === 0) return avatarId;

    return Object.entries(caughtCounts).reduce((fav, current) => {
      return current[1] > fav[1] ? current : fav;
    })[0];
  }, [caughtCounts, avatarId]);

  const uniqueCaughtCount = Object.keys(caughtCounts).length;
  const pokedexCompletion = ((uniqueCaughtCount / 151) * 100).toFixed(1);

  const avatarUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${avatarId}.png`;
  const favoritePokemonUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${favoritePokemonId}.png`;

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <View className="items-center">
        <View className="relative">
          <Image
            source={{ uri: avatarUrl }}
            className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg"
          />
          {/* 수정 버튼 */}
          <Pressable
            onPress={() => setIsEditModalVisible(true)}
            className="absolute -bottom-1 -right-1 bg-blue-500 p-2 rounded-full border-2 border-white"
          >
            <FontAwesome name="pencil" size={16} color="white" />
          </Pressable>
        </View>

        <Text className="text-2xl font-bold mt-3">{username}</Text>
        <Text className="text-gray-500 mt-1 text-center">{bio}</Text>
      </View>

      {/* 요약 정보 카드 */}
      <View className="mt-6">
        <Text className="text-lg font-bold mb-2 text-gray-700">요약</Text>
        <View className="flex-row gap-3">
          <StatSummaryCard
            title="도감 완성도"
            value={pokedexCompletion}
            unit="%"
          />
          <StatSummaryCard
            title="잡은 종류"
            value={uniqueCaughtCount}
            unit="마리"
          />
        </View>
      </View>

      {/* 파트너 포켓몬 */}
      <View className="mt-6">
        <Text className="text-lg font-bold mb-2 text-gray-700">
          파트너 포켓몬
        </Text>
        <View className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex-row items-center">
          <Image
            source={{ uri: favoritePokemonUrl }}
            className="w-16 h-16 bg-gray-100 rounded-full"
          />
          <View className="ml-4">
            <Text className="text-sm text-gray-500">가장 많이 만난 포켓몬</Text>
            <Text className="text-xl font-bold">
              포켓몬 #{favoritePokemonId}
            </Text>
          </View>
        </View>
      </View>

      {/* 프로필 수정 모달 */}
      <ProfileEditModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
      />
    </SafeAreaView>
  );
}
