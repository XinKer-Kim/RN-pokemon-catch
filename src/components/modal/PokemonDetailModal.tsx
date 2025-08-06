import { useModalStore } from "@/src/store/modalStore";
import { Image, Modal, Pressable, Text, View } from "react-native";

export function PokemonDetailModal() {
  // 1. 전역 스토어에서 상태와 액션을 가져옵니다.
  const { isVisible, pokemonData, closeModal } = useModalStore();

  // 2. 보여줄 데이터가 없으면 아무것도 렌더링하지 않습니다.
  if (!pokemonData) {
    return null;
  }

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-11/12 rounded-2xl p-4 items-center shadow-lg">
          {/* 포켓몬 이미지 */}
          <Image
            source={{ uri: pokemonData.spriteUrl }}
            className="w-48 h-48 -mt-20"
            resizeMode="contain"
          />
          {/* 포켓몬 이름 */}
          <Text
            className="text-3xl font-bold mt-2"
            style={{ fontFamily: "DungGeunMo" }}
          >
            {pokemonData.koreanName}
          </Text>

          {/* 포획, 닫기 버튼 */}
          <View className="flex-row w-full mt-6">
            <Pressable className="flex-1 bg-red-500 py-3 rounded-lg mr-2">
              <Text className="text-white text-center text-lg font-bold">
                포획
              </Text>
            </Pressable>
            <Pressable
              onPress={closeModal} // 3. 닫기 버튼에 스토어의 closeModal 액션을 연결
              className="flex-1 bg-gray-300 py-3 rounded-lg ml-2"
            >
              <Text className="text-black text-center text-lg font-bold">
                닫기
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
