// /components/card/PokemonCard.tsx

import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

// 1. 컴포넌트가 받을 props의 타입을 정의합니다.
type PokemonCardProps = {
  pokemonId: string;
};

// 2. API 응답 데이터 중에서 사용할 것들의 타입만 정의합니다.
interface PokemonData {
  name: string;
  sprites: {
    front_default: string;
  };
}

// props에 위에서 정의한 타입을 적용합니다.
export function PokemonCard({ pokemonId }: PokemonCardProps) {
  // 3. useState를 사용할 때, 어떤 타입의 state인지 제네릭(<>)으로 명시합니다.
  // PokemonData 타입이거나, 아직 데이터가 없으면 null일 수 있습니다.
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`
        );
        // 받아온 json 데이터가 PokemonData 타입일 것이라고 명시해줍니다.
        const data = (await response.json()) as PokemonData;
        setPokemonData(data);
      } catch (error) {
        console.error(
          `Failed to fetch pokemon data for ID ${pokemonId}:`,
          error
        );
        setPokemonData(null); // 에러 발생 시 데이터를 null로 초기화
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonData();
  }, [pokemonId]);

  if (isLoading) {
    return (
      <View className="flex-1 h-60 m-1 justify-center items-center bg-gray-100 rounded-lg">
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  if (!pokemonData) {
    return (
      <View className="flex-1 h-60 m-1 justify-center items-center bg-red-100 rounded-lg">
        <Text style={{ fontFamily: "DungGeunMo" }}>데이터</Text>
        <Text style={{ fontFamily: "DungGeunMo" }}>불러오기 실패</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 h-60 m-1">
      <View className="w-full h-full bg-gray-100 justify-center items-center rounded-lg border border-gray-200">
        <>
          {/* 이제 pokemonData.sprites.front_default 를 입력할 때 자동완성이 지원됩니다. */}
          <Image
            source={{ uri: pokemonData.sprites.front_default }}
            className="w-32 h-32"
            resizeMode="contain"
          />
          <Text
            className="text-lg capitalize"
            style={{ fontFamily: "DungGeunMo" }}
          >
            {pokemonData.name}
          </Text>
        </>
      </View>
    </View>
  );
}
