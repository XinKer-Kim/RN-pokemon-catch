import { PokemonCard } from "@/src/components/card/PokemonCard";
import { AppHeader } from "@/src/components/common";
import { FlatList, Text, View } from "react-native";
// 2. 데이터는 이제 API로 호출할 포켓몬의 ID 목록이 됩니다.
const pokemonToFetch = [
  { id: "25" }, // 피카츄
  { id: "133" }, // 이브이
  { id: "1" }, // 이상해씨
  { id: "4" }, // 파이리
  { id: "7" }, // 꼬부기
  { id: "143" }, // 잠만보
];
const pokemonData = [
  { id: "1", color: "bg-green-50", name: "이상해씨" },
  {
    id: "2",
    color: "bg-yellow-50",
    name: "피카츄",
    // style: { borderWidth: 1, borderColor: "#eee" },
  },
  { id: "3", color: "bg-blue-50", name: "꼬부기" },
  { id: "4", color: "bg-red-50", name: "파이리" },
];
export default function Index() {
  return (
    <View className="w-full h-full">
      <AppHeader />
      <Text className="text-3xl" style={{ fontFamily: "DungGeunMo" }}>
        Gotta Catch &apos;Em All
      </Text>
      <Text style={{ fontFamily: "DungGeunMo", fontSize: 24 }}>
        야생의 포켓몬이(가) 나타났다!
      </Text>
      <FlatList
        data={pokemonToFetch}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PokemonCard pokemonId={item.id} />}
      />
    </View>
  );
}
