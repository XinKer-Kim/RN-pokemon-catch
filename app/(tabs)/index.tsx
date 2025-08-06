import { PokemonCard } from "@/src/components/card/PokemonCard";
import { AppHeader } from "@/src/components/common";
import { useEffect, useState } from "react"; // useState와 useEffect를 import 합니다.
import { FlatList, Pressable, Text, View } from "react-native";

type PokemonId = {
  id: string;
};

export default function Index() {
  // 1. 동적인 포켓몬 목록을 저장하기 위한 state를 생성합니다.
  const [pokemonList, setPokemonList] = useState<PokemonId[]>([]);

  // 2. 랜덤 포켓몬 목록을 생성하는 함수 정의.
  const generateRandomPokemon = () => {
    const POKEMON_COUNT = 10; // 한 번에 보여줄 포켓몬 수
    const MAX_ID = 151; // 포켓몬 ID의 최대값

    // 1부터 151까지의 모든 숫자가 담긴 배열을 생성합니다.
    const allIds = Array.from({ length: MAX_ID }, (_, i) => i + 1);

    // 배열을 무작위로 섞습니다 (Fisher-Yates Shuffle과 유사한 방식).
    for (let i = allIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
    }

    // 섞인 배열에서 앞의 10개를 잘라내고, FlatList가 요구하는 객체 형태로 변환합니다.
    const randomIds = allIds.slice(0, POKEMON_COUNT).map((id) => ({
      id: String(id),
    }));

    setPokemonList(randomIds);
  };

  // 3. 컴포넌트가 처음 마운트될 때 한 번만 랜덤 포켓몬을 생성합니다.
  useEffect(() => {
    generateRandomPokemon();
  }, []); // 의존성 배열이 비어있으면 최초 1회만 실행됩니다.

  return (
    <View className="w-full h-full p-2">
      <AppHeader />

      {/* 4. 포켓몬 목록 갱신 버튼 */}
      <Pressable
        onPress={generateRandomPokemon}
        className="bg-green-600 p-4 rounded-lg my-4"
      >
        <Text className="text-white text-center font-bold text-lg">
          사파리존! 새로운 포켓몬 만나기
        </Text>
      </Pressable>

      <Text style={{ fontFamily: "DungGeunMo", fontSize: 24 }}>
        야생의 포켓몬이(가) 나타났다!
      </Text>

      {/* 5. FlatList의 data로 state(pokemonList)전달 */}
      <FlatList
        data={pokemonList}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PokemonCard pokemonId={item.id} />}
      />
    </View>
  );
}
