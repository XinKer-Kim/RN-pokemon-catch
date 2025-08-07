// /app/pokemon/[id].tsx

import { PokemonStats } from "@/src/components/pokedex/PokemonStats"; // 1. 새로 만든 스탯 컴포넌트 import
import { typeDetails } from "@/src/constants/pokemonTypes";
import { usePokedexStore } from "@/src/store/pokedexStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface PokemonDetail {
  id: number;
  koreanName: string;
  spriteUrl: string;
  types: { type: { name: string } }[];
  height: number; // 미터(m)
  weight: number; // 킬로그램(kg)
  koreanCategory: string; // "씨앗포켓몬" 등
  koreanFlavorText: string; // 도감 설명
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
  colorName: string;
}

export default function PokemonDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const caughtCounts = usePokedexStore((state) => state.caughtCounts);

  const [details, setDetails] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCaught = !!(id && caughtCounts[id]);

  useEffect(() => {
    if (!id || !isCaught) {
      setIsLoading(false);
      return;
    }
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const [pokemonRes, speciesRes] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
        ]);
        const pokemonData = await pokemonRes.json();
        const speciesData = await speciesRes.json();

        const koreanName =
          speciesData.names.find((n) => n.language.name === "ko")?.name ??
          pokemonData.name;
        const koreanCategory =
          speciesData.genera.find((g) => g.language.name === "ko")?.genus ??
          "포켓몬";
        const koreanFlavorText =
          speciesData.flavor_text_entries
            .find(
              (ft) =>
                ft.language.name === "ko" &&
                (ft.version.name === "y" || ft.version.name === "sword")
            )
            ?.flavor_text.replace(/\s/g, " ") ?? "도감 데이터 없음";

        setDetails({
          id: pokemonData.id,
          koreanName,
          koreanCategory,
          koreanFlavorText,
          spriteUrl: pokemonData.sprites.front_default,
          types: pokemonData.types,
          height: pokemonData.height / 10,
          weight: pokemonData.weight / 10,
          stats: pokemonData.stats,
          colorName: speciesData.color.name,
        });
      } catch (error) {
        console.error("Failed to fetch pokemon details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id, isCaught]);

  const navigateToPokemon = (newId: number) => {
    if (newId > 0 && newId <= 151) {
      router.replace(`/pokemon/${newId}`);
    }
  };

  if (isLoading) return <ActivityIndicator className="flex-1" size="large" />;

  const currentId = parseInt(id || "0", 10);

  return (
    <SafeAreaView className="flex-1 p-4 bg-gray-800">
      {/* 상단: 이름, 번호, 그리고 닫기 버튼 */}
      <View className="flex-row justify-between items-center relative h-12">
        {/* 2. 닫기 버튼 추가 */}
        <Pressable
          // onPress={() => router.back()} //홈으로 보내버려서 의도치 않게 작동.
          onPress={() => navigate("/(tabs)/pokedex")} //TODO : 뒤로 갔을 때 열려있는 도감 내용으로 이어가기.
          className="absolute left-0 z-10 bg-blue-500 p-2 rounded-lg"
        >
          <Text className="text-white font-bold">닫기</Text>
        </Pressable>
        <Text className="text-white text-3xl font-bold text-center flex-1">
          {isCaught ? details?.koreanName : "???"}
        </Text>
        <Text className="text-white text-2xl font-bold">
          #{String(currentId).padStart(4, "0")}
        </Text>
      </View>

      {/* 중단: 이미지와 정보 */}
      <View className="bg-white rounded-lg mt-4 p-4 flex-1">
        {/* 1. UI 레이아웃 수정: 이미지 자체에 음수 마진을 적용하여 카드 전체가 아닌 이미지만 위로 올라오도록 수정 */}
        <View className="items-center">
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentId}.png`,
            }}
            className="w-48 h-48 -mt-24 bg-gray-100 rounded-full border-4 border-white"
            style={!isCaught ? { tintColor: "black" } : {}}
          />
        </View>
        {/* 1. 긴 도감 설명이 잘리지 않도록 ScrollView 추가 */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {isCaught && details ? (
            // --- 잡았을 때 보여줄 정보 ---
            <View className="items-center">
              <Text className="text-2xl font-bold mt-2">
                {details.koreanName}
              </Text>

              <View className="flex-row justify-center gap-2 my-2">
                {details.types.map(({ type }) => (
                  <View
                    key={type.name}
                    className="px-3 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        typeDetails[type.name]?.color ?? "#A8A77A",
                    }}
                  >
                    <Text className="text-white font-bold text-sm">
                      {typeDetails[type.name]?.koreanName ?? type.name}
                    </Text>
                  </View>
                ))}
              </View>
              <Text className="text-lg font-bold mt-2">
                {details.koreanCategory}
              </Text>
              <View className="flex-row justify-around my-4 w-full">
                <View className="items-center">
                  <Text className="text-gray-500">키</Text>
                  <Text className="font-bold text-lg">{details.height}m</Text>
                </View>
                <View className="items-center">
                  <Text className="text-gray-500">몸무게</Text>
                  <Text className="font-bold text-lg">{details.weight}kg</Text>
                </View>
              </View>
              <Text className="text-center leading-6 px-2">
                {details.koreanFlavorText}
              </Text>
              <PokemonStats
                stats={details?.stats}
                colorName={details.colorName}
              />
            </View>
          ) : (
            // --- 못 잡았을 때 보여줄 정보 ---
            <View className="flex-1 justify-center items-center h-48">
              <Text className="text-2xl font-bold text-gray-400">?????</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* 하단: 네비게이션 */}
      <View className="flex-row justify-between mt-4">
        <Pressable
          onPress={() => navigateToPokemon(currentId - 1)}
          className="bg-blue-500 p-3 rounded-lg"
        >
          <Text className="text-white font-bold">이전</Text>
        </Pressable>
        <Pressable
          onPress={() => navigateToPokemon(currentId + 1)}
          className="bg-blue-500 p-3 rounded-lg"
        >
          <Text className="text-white font-bold">다음</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
