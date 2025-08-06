import { useRouter } from "expo-router";
import { Image, Pressable, Text } from "react-native";

interface PokedexGridItemProps {
  name: string;
  url: string;
  isCaught: boolean; // 포획 여부를 prop으로 받음
}

// URL에서 포켓몬 ID를 추출하는 헬퍼 함수 (기존과 동일)
const extractIdFromUrl = (url: string): string => {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
};

export function PokedexGridItem({ name, url, isCaught }: PokedexGridItemProps) {
  const router = useRouter();
  const id = extractIdFromUrl(url);

  // API 호출 없이 이미지 URL을 직접 구성하여 성능 최적화 (기존과 동일)
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  const handlePress = () => {
    router.push(`/pokemon/${id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-1 aspect-square justify-center items-center m-1 bg-gray-100 rounded-lg"
    >
      <Image
        source={{ uri: spriteUrl }}
        className="w-20 h-20"
        resizeMode="contain"
        // isCaught 상태에 따라 스타일을 동적으로 적용합니다.
        style={!isCaught ? { filter: "brightness(0%)" } : {}}
      />
      <Text className="font-bold text-xs text-gray-500 mt-1">
        {id.padStart(4, "0")}
      </Text>
    </Pressable>
  );
}
