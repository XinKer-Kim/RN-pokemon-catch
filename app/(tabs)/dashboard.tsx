import { typeDetails } from "@/src/constants/pokemonTypes";
import { useModalStore } from "@/src/store/modalStore";
import { usePokedexStore } from "@/src/store/pokedexStore";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 정보 카드를 위한 작은 컴포넌트
const InfoCard = ({
  title,
  value,
  unit,
}: {
  title: string;
  value: string | number;
  unit: string;
}) => (
  <View className="bg-white p-4 rounded-lg flex-1 items-center shadow-md">
    <Text className="text-gray-500">{title}</Text>
    <View className="flex-row items-baseline mt-1">
      <Text className="text-3xl font-bold">{value}</Text>
      <Text className="text-lg ml-1">{unit}</Text>
    </View>
  </View>
);

// 타입별 포획 현황 바
const TypeBar = ({ typeName, count }: { typeName: string; count: number }) => {
  const detail = typeDetails[typeName];
  if (!detail) return null;

  return (
    <View className="flex-row items-center my-1">
      <View
        className="w-8 h-8 rounded-full mr-3"
        style={{ backgroundColor: detail.color }}
      />
      <Text className="w-16 font-bold">{detail.koreanName}</Text>
      <Text>{count} 마리</Text>
    </View>
  );
};
export default function DashboardScreen() {
  const { caughtCounts } = usePokedexStore();
  const { safariBalls } = useModalStore();

  const totalCaughtCount = Object.values(caughtCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  const uniqueCaughtCount = Object.keys(caughtCounts).length;
  const pokedexCompletion = ((uniqueCaughtCount / 151) * 100).toFixed(1);

  // 이 부분은 실제 API 호출이 필요하지만, 지금은 가상 데이터로 구현합니다.
  const typeDistribution = {
    grass: 5,
    poison: 4,
    fire: 2,
    water: 3,
    bug: 6,
    normal: 7,
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-4">
        <Text className="text-3xl font-bold mb-4">대시보드</Text>

        <View className="flex-row gap-4 mb-6">
          <InfoCard title="총 포획 수" value={totalCaughtCount} unit="마리" />
          <InfoCard title="남은 사파리볼" value={safariBalls} unit="개" />
        </View>

        <View className="bg-white p-4 rounded-lg shadow-md mb-6">
          <Text className="text-lg font-bold mb-2">도감 완성도</Text>
          <Text className="text-4xl font-bold text-blue-600 self-center my-2">
            {pokedexCompletion}%
          </Text>
          <Text className="text-center text-gray-600">
            {uniqueCaughtCount} / 151 종류
          </Text>
        </View>

        <View className="bg-white p-4 rounded-lg shadow-md">
          <Text className="text-lg font-bold mb-3">타입별 포획 현황</Text>
          {Object.entries(typeDistribution).map(([typeName, count]) => (
            <TypeBar key={typeName} typeName={typeName} count={count} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
