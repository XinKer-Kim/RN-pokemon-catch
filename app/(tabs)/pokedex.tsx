// /app/pokedex.tsx

import { PokedexGridItem } from "@/src/components/pokedex/PokedexGridItem";
import { usePokedexStore } from "@/src/store/pokedexStore"; // 1. 도감 스토어를 import 합니다.
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 포켓몬 목록 API의 응답 타입
interface PokemonListResult {
  name: string;
  url: string;
}

const caughtPokemonIds = usePokedexStore((state) => state.caughtPokemonIds);

export default function PokedexScreen() {
  const [pokemonList, setPokemonList] = useState<PokemonListResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKantoPokemon = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0"
        );
        const data = await response.json();
        setPokemonList(data.results);
      } catch (error) {
        console.error("Failed to fetch Kanto pokemon list:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKantoPokemon();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-2">
      {/* 헤더 UI */}
      <View className="flex-row justify-between items-center mb-4 px-2">
        <Text
          className="text-2xl font-bold"
          style={{ fontFamily: "DungGeunMo" }}
        >
          관동 도감
        </Text>
        <Text className="font-bold text-lg">{caughtPokemonIds.size} / 151</Text>
      </View>

      {/* 포켓몬 그리드 리스트 */}
      <FlatList
        data={pokemonList}
        numColumns={4} // 한 줄에 4개씩 표시
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => {
          // API 응답의 index는 0부터 시작하므로 +1 해줍니다.
          const id = String(index + 1);
          return (
            <PokedexGridItem
              name={item.name}
              url={item.url}
              // isCaught 상태를 넘겨주어 실루엣 효과를 제어합니다.
              isCaught={caughtPokemonIds.has(id)}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}
