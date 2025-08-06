// /app/pokedex.tsx

import { PokedexGridItem } from "@/src/components/pokedex/PokedexGridItem";
import { usePokedexStore } from "@/src/store/pokedexStore";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PokemonListResult {
  name: string;
  url: string;
}

const POKEMON_LIMIT = 20; // 한 번에 불러올 포켓몬 수
const TOTAL_POKEMON = 151; // 전체 포켓몬 수

export default function PokedexScreen() {
  const caughtCounts = usePokedexStore((state) => state.caughtCounts);

  const [pokemonList, setPokemonList] = useState<PokemonListResult[]>([]);
  const [offset, setOffset] = useState(0); // 데이터를 어디서부터 불러올지 결정
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태
  const [isFetchingMore, setIsFetchingMore] = useState(false); // 추가 데이터 로딩 상태

  // 데이터를 불러오는 핵심 함수
  const fetchPokemon = useCallback(async (currentOffset: number) => {
    // 이미 모든 포켓몬을 불러왔거나, 로딩 중이면 함수를 종료합니다.
    if (currentOffset >= TOTAL_POKEMON) return;

    // 추가 데이터를 불러올 때만 isFetchingMore를 true로 설정합니다.
    if (currentOffset > 0) {
      setIsFetchingMore(true);
    }

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}&offset=${currentOffset}`
      );
      const data = await response.json();

      // 새로 불러온 데이터를 기존 리스트 뒤에 추가합니다.
      setPokemonList((prevList) => [...prevList, ...data.results]);
    } catch (error) {
      console.error("Failed to fetch Kanto pokemon list:", error);
    } finally {
      // 로딩 상태를 모두 false로 변경합니다.
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, []);

  // 컴포넌트가 처음 마운트될 때 첫 데이터를 불러옵니다.
  useEffect(() => {
    fetchPokemon(0);
  }, [fetchPokemon]);

  // 스크롤이 리스트의 끝에 닿았을 때 호출될 함수
  const handleLoadMore = () => {
    // 현재 로딩 중이 아닐 때만 다음 데이터를 불러옵니다.
    if (!isFetchingMore) {
      const nextOffset = offset + POKEMON_LIMIT;
      setOffset(nextOffset); // offset 상태 업데이트
      fetchPokemon(nextOffset); // 새로운 offset으로 데이터 요청
    }
  };

  // 리스트의 맨 아래에 표시될 로딩 인디케이터
  const renderFooter = () => {
    return isFetchingMore ? (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ marginVertical: 20 }}
      />
    ) : null;
  };

  // 초기 로딩 화면
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
        <Text className="font-bold text-lg">
          {Object.keys(caughtCounts || {}).length} / {TOTAL_POKEMON}
        </Text>
      </View>

      <FlatList
        data={pokemonList}
        numColumns={4}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          // URL에서 ID를 추출하는 로직이 필요합니다.
          const id = item.url.split("/").filter(Boolean).pop() || "0";
          return (
            <PokedexGridItem
              name={item.name}
              url={item.url}
              isCaught={!!(caughtCounts && caughtCounts[id])}
            />
          );
        }}
        // --- 무한 스크롤을 위한 속성들 ---
        onEndReached={handleLoadMore} // 스크롤이 끝에 닿았을 때 호출
        onEndReachedThreshold={0.5} // 리스트 끝에서 50% 지점에 닿으면 호출
        ListFooterComponent={renderFooter} // 리스트 맨 아래에 렌더링될 컴포넌트
      />
    </SafeAreaView>
  );
}
