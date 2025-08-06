// /app/pokedex.tsx

import { PokedexGridItem } from "@/src/components/pokedex/PokedexGridItem";
import { usePokedexStore } from "@/src/store/pokedexStore"; // 도감 스토어를 import 합니다.
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PokemonListResult {
  name: string;
  url: string;
}

export default function PokedexScreen() {
  // 스토어에서 `caughtCounts` 객체를 올바르게 선택하여 가져옵니다.
  const caughtCounts = usePokedexStore((state) => state.caughtCounts);

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
      <View className="flex-row justify-between items-center mb-4 px-2">
        <Text
          className="text-2xl font-bold"
          style={{ fontFamily: "DungGeunMo" }}
        >
          관동 도감
        </Text>
        {/* 1. caughtCounts가 undefined일 경우 빈 객체({})를 사용하도록 수정 */}
        <Text className="font-bold text-lg">
          {Object.keys(caughtCounts || {}).length} / 151
        </Text>
      </View>

      <FlatList
        data={pokemonList}
        numColumns={4}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => {
          const id = String(index + 1);
          return (
            <PokedexGridItem
              name={item.name}
              url={item.url}
              // 2. caughtCounts가 존재할 때만 id를 확인하도록 수정
              isCaught={!!(caughtCounts && caughtCounts[id])}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}
