// /src/components/card/TypeCard.tsx

import { typeDetails } from "@/src/constants/pokemonTypes"; // 이전에 만든 타입 상수
import { Pressable, Text, View } from "react-native";

interface TypeCardProps {
  typeName: string; // "fire", "water" 같은 영어 이름
  onPress: () => void;
}

export function TypeCard({ typeName, onPress }: TypeCardProps) {
  // 타입 영어 이름으로 한글 이름과 색상 정보를 가져옵니다.
  const details = typeDetails[typeName];

  // 만약 정의되지 않은 타입이라면 표시하지 않음 (안전장치)
  if (!details) {
    return null;
  }

  return (
    <View className="flex-1 m-1">
      <Pressable
        onPress={onPress}
        className="p-4 h-24 justify-center items-center rounded-lg"
        style={{ backgroundColor: details.color }}
      >
        <Text className="text-white text-lg font-bold">
          {details.koreanName}
        </Text>
      </Pressable>
    </View>
  );
}
