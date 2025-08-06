// /components/card/PokemonCard.tsx
import { typeDetails } from "@/src/constants/pokemonTypes";
import { useModalStore } from "@/src/store/modalStore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

// --- 타입 정의 섹션 ---
type PokemonCardProps = {
  pokemonId: string;
};

// 'pokemon' API에서 가져올 데이터 타입
interface PokemonApiResponse {
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
      url: string;
    };
  }[];
}

// 'pokemon-species' API에서 가져올 데이터 타입 (필요한 부분만)
interface PokemonSpeciesApiResponse {
  capture_rate: number;
  names: {
    language: { name: string };
    name: string;
  }[];
}

// 화면에 표시하기 위해 두 API의 데이터를 조합한 최종 데이터 타입
interface DisplayPokemonData {
  id: string;
  koreanName: string;
  englishName: string;
  spriteUrl: string;
  types: PokemonApiResponse["types"]; // PokemonApiResponse의 types 타입을 그대로 사용
  baseCaptureRate: number;
}

export function PokemonCard({ pokemonId }: PokemonCardProps) {
  const { openModal } = useModalStore();
  const [pokemonData, setPokemonData] = useState<DisplayPokemonData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- 데이터 패칭 섹션 ---
  // useEffect 훅을 사용하여 컴포넌트가 마운트될 때 API를 호출합니다.
  // pokemonId가 변경될 때마다 새로운 데이터를 가져옵니다.
  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setIsLoading(true);

        // 1. 두 개의 API를 동시에 호출합니다.
        const [pokemonResponse, speciesResponse] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`),
        ]);

        // 2. 두 응답을 각각 json으로 파싱합니다.
        const pokemonResult =
          (await pokemonResponse.json()) as PokemonApiResponse;
        const speciesResult =
          (await speciesResponse.json()) as PokemonSpeciesApiResponse;

        // 3. 'pokemon-species' 결과에서 한국어 이름을 찾습니다.
        // find() 메서드로 language.name이 'ko'인 객체를 찾습니다.
        const koreanNameEntry = speciesResult.names.find(
          (entry) => entry.language.name === "ko"
        );

        // 한글 이름이 있으면 사용하고, 없으면 영어 이름을 대신 사용 (Fallback)
        const koreanName = koreanNameEntry?.name ?? pokemonResult.name;

        // 4. 최종 데이터에 types 정보도 함께 저장합니다.

        setPokemonData({
          id: pokemonId,
          koreanName: koreanName,
          spriteUrl: pokemonResult.sprites.front_default,
          types: pokemonResult.types,
          baseCaptureRate: speciesResult.capture_rate, // 4. API에서 받은 포획률 저장
        });
      } catch (error) {
        console.error(
          `Failed to fetch pokemon data for ID ${pokemonId}:`,
          error
        );
        setPokemonData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonData();
  }, [pokemonId]);

  // --- 렌더링 섹션 (이하 동일, 텍스트만 변경) ---
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
      <Pressable
        onPress={() => openModal(pokemonData)}
        className="w-full h-full bg-white justify-between items-center rounded-lg border border-gray-200"
      >
        {/* 포켓몬 이름과 이미지를 담는 상단 View */}
        <View className="w-full items-center -m-2">
          <Image
            source={{ uri: pokemonData.spriteUrl }}
            className="w-48 h-48"
            resizeMode="contain"
          />
          <Text
            className="text-2xl font-semibold -m-6"
            style={{ fontFamily: "DungGeunMo" }}
          >
            {pokemonData.koreanName}
          </Text>
        </View>

        {/* 5. 타입 뱃지를 렌더링하는 View */}
        <View className="flex-row gap-x-1 mb-3">
          {pokemonData.types.map(({ type }) => (
            // type.name (영어이름)을 키로 사용합니다.
            <View
              key={type.name}
              className="px-3 py-1 rounded-lg"
              // `typeDetails`에서 영어 이름에 맞는 색상을 찾아 적용합니다.
              style={{
                backgroundColor: typeDetails[type.name]?.color ?? "#A8A77A",
              }}
            >
              <Text className="text-white text-s font-bold">
                {/* `typeDetails`에서 영어 이름에 맞는 한글 이름을 찾아 표시합니다. */}
                {typeDetails[type.name]?.koreanName ?? type.name}
              </Text>
            </View>
          ))}
        </View>
      </Pressable>
      {/* <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView className="p-4">
          <View className="flex-row w-full items-center">
            <Image
              source={{ uri: pokemonData.spriteUrl }}
              className="w-24 h-24"
            />
            <Pressable className="bg-amber-100 py-3 px-4">
              <Text className="text-2xl font-semibold -m-6">포획</Text>
            </Pressable>
            <Pressable
              onPress={() => setModalVisible(false)}
              className="bg-neutral-100 py-4 px-6"
            >
              <Text className="text-2xl font-semibold -m-6">닫기</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal> */}
    </View>
  );
}
