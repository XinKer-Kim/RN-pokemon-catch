// /src/components/modal/PokemonDetailModal.tsx

import { useModalStore } from "@/src/store/modalStore";
import { useEffect, useRef } from "react";
import {
  Animated,
  ImageBackground,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

// 액션 버튼을 위한 작은 컴포넌트
const ActionButton = ({
  text,
  onPress,
  disabled,
  color = "bg-gray-700",
}: any) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    className={`flex-1 p-3 rounded-md ${color} ${disabled ? "opacity-50" : ""}`}
  >
    <Text className="text-white text-center font-bold text-base">{text}</Text>
  </Pressable>
);

export function PokemonDetailModal() {
  const {
    isVisible,
    pokemonData,
    gameStatus,
    message,
    closeModal,
    throwBall,
    throwBait,
    throwMud,
  } = useModalStore();
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (gameStatus === "THROWING_BALL") {
      // 볼 던질 때 포켓볼이 흔들리는 애니메이션
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [gameStatus]);

  if (!pokemonData) return null;

  const isActionable = gameStatus === "ENCOUNTER" || gameStatus === "FAIL";

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <ImageBackground
        source={{
          uri: "https://img.freepik.com/premium-vector/pixel-art-game-background-grass-sky-clouds_210544-62.jpg",
        }}
        className="flex-1 justify-end"
      >
        <View className="absolute top-1/4 self-center">
          {/* 포켓몬 이미지 */}
          <Animated.Image
            source={{ uri: pokemonData.spriteUrl }}
            className="w-64 h-64"
            style={{ transform: [{ translateX: shakeAnimation }] }}
          />
        </View>

        {/* 하단 UI 영역 */}
        <View className="bg-black/70 border-t-4 border-gray-500 p-2">
          {/* 메시지 창 */}
          <View className="bg-white rounded-lg p-3 h-24 justify-center border-4 border-gray-300">
            <Text className="text-lg" style={{ fontFamily: "DungGeunMo" }}>
              {message}
            </Text>
          </View>

          {/* 액션 버튼 */}
          <View className="flex-row gap-2 mt-2">
            {gameStatus === "CAUGHT" || gameStatus === "FLED" ? (
              <ActionButton
                text="닫기"
                onPress={closeModal}
                color="bg-blue-600"
              />
            ) : (
              <>
                <ActionButton
                  text="볼"
                  onPress={throwBall}
                  disabled={!isActionable}
                  color="bg-red-600"
                />
                <ActionButton
                  text="먹이"
                  onPress={throwBait}
                  disabled={!isActionable}
                  color="bg-yellow-600"
                />
                <ActionButton
                  text="진흙"
                  onPress={throwMud}
                  disabled={!isActionable}
                  color="bg-orange-800"
                />
                <ActionButton
                  text="도망"
                  onPress={closeModal}
                  disabled={!isActionable}
                />
              </>
            )}
          </View>
        </View>
      </ImageBackground>
    </Modal>
  );
}
