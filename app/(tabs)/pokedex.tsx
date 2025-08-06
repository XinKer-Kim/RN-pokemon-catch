// /app/pokedex.tsx

import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// PokedexGridItem을 import 합니다. TypeCard는 더 이상 필요 없습니다.
import { PokedexGridItem } from "@/src/components/pokedex/PokedexGridItem";

// 포켓몬 목록 API의 응답 타입
interface PokemonListResult {
  name: string;
  url: string;
}

// 임시로 포획한 포켓몬 ID 목록을 만듭니다. (나중에는 실제 데이터로 대체)
const caughtPokemonIds = new Set(["1", "2", "3", "4", "25", "149"]);

export default function PokedexScreen() {
  const [pokemonList, setPokemonList] = useState<PokemonListResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 기존의 타입 목록 대신 칸토 지방 포켓몬 목록을 불러오는 함수로 변경
    const fetchKantoPokemon = async () => {
      try {
        setIsLoading(true);
        // 151마리 포켓몬 목록을 한 번에 가져옵니다.
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
          칸토 도감
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
