// /app/(tabs)/dashboard.tsx

import { useModalStore } from "@/src/store/modalStore";
import { usePokedexStore } from "@/src/store/pokedexStore";
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
  <View className="bg-white p-4 rounded-lg flex-1 items-center shadow-md border border-gray-200">
    <Text className="text-gray-500 font-semibold">{title}</Text>
    <View className="flex-row items-baseline mt-1">
      <Text className="text-3xl font-bold text-gray-800">{value}</Text>
      <Text className="text-lg ml-1 text-gray-700">{unit}</Text>
    </View>
  </View>
);

// 진행률 바 컴포넌트
const ProgressBar = ({ progress }: { progress: number }) => (
  <View className="w-full bg-gray-200 rounded-full h-4 my-2">
    <View
      className="bg-blue-500 h-4 rounded-full"
      style={{ width: `${progress}%` }}
    />
  </View>
);

export default function DashboardScreen() {
  // 1. 각 스토어에서 필요한 데이터를 가져옵니다.
  const { caughtCounts } = usePokedexStore();
  const { safariBalls } = useModalStore();

  // 2. 가져온 데이터를 바탕으로 대시보드에 표시할 값들을 계산합니다.
  const totalCaughtCount = Object.values(caughtCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  const uniqueCaughtCount = Object.keys(caughtCounts).length;
  const pokedexCompletion = Math.min((uniqueCaughtCount / 151) * 100, 100); // 최대 100%

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-4">
        <Text className="text-3xl font-bold mb-6 text-gray-800">대시보드</Text>

        {/* 상단 정보 카드 */}
        <View className="flex-row gap-4 mb-6">
          <InfoCard title="총 포획 수" value={totalCaughtCount} unit="마리" />
          <InfoCard title="남은 사파리볼" value={safariBalls} unit="개" />
        </View>

        {/* 도감 완성도 섹션 */}
        <View className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
          <Text className="text-lg font-bold mb-2 text-gray-800">
            도감 완성도
          </Text>
          <Text className="text-4xl font-bold text-blue-600 self-center my-2">
            {pokedexCompletion.toFixed(1)}%
          </Text>
          <ProgressBar progress={pokedexCompletion} />
          <Text className="text-center text-gray-600 mt-1">
            {uniqueCaughtCount} / 151 종류
          </Text>
        </View>

        {/* 타입별 포획 현황 (향후 구현) */}
        <View className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <Text className="text-lg font-bold mb-3 text-gray-800">
            타입별 포획 현황
          </Text>
          <View className="h-24 justify-center items-center">
            <Text className="text-gray-500">(준비 중인 기능입니다)</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
