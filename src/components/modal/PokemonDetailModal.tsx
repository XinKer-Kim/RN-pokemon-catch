// /src/components/modal/PokemonDetailModal.tsx

import { useModalStore } from "@/src/store/modalStore";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
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
  // 2. safariBalls와 runAway 액션을 스토어에서 가져옵니다.
  const {
    isVisible,
    pokemonData,
    gameStatus,
    message,
    safariBalls,
    closeModal,
    throwBall,
    throwBait,
    throwMud,
    runAway,
  } = useModalStore();
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (gameStatus === "THROWING_BALL") {
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

  const isActionable = gameStatus === "ENCOUNTER";
  // 1. 게임 종료 상태인지 확인하는 변수
  const isGameEnd =
    gameStatus === "CAUGHT" ||
    gameStatus === "POKEMON_FLED" ||
    gameStatus === "PLAYER_FLED";

  const handlePressOnEnd = () => {
    // 게임이 종료된 상태에서만 모달을 닫습니다.
    if (isGameEnd) {
      closeModal();
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      {/* 1. 모달 전체를 감싸는 Pressable 추가. 게임 종료 시에만 활성화됩니다. */}
      <Pressable
        onPress={handlePressOnEnd}
        disabled={!isGameEnd}
        className="flex-1"
      >
        <ImageBackground
          source={{
            uri: "https://static.wikia.nocookie.net/pokemon/images/c/cb/%EA%B4%80%EB%8F%99_%EC%82%AC%ED%8C%8C%EB%A6%AC%EC%A1%B4_%ED%8C%8C%EB%A0%88%EB%A6%AC%EA%B7%B8_%EB%8C%80%ED%91%9C_%EC%9D%B4%EB%AF%B8%EC%A7%80.png/revision/latest?cb=20110828144647&path-prefix=ko",
          }}
          className="flex-1 justify-end"
        >
          <View className="absolute top-1/4 self-center">
            <Animated.Image
              source={{ uri: pokemonData.spriteUrl }}
              className="w-64 h-64"
              style={{ transform: [{ translateX: shakeAnimation }] }}
            />
          </View>

          <View className="bg-black/70 border-t-4 border-gray-500 p-2">
            {/* 2. 볼 개수 표시 UI 추가 */}
            <View className="absolute -top-12 right-4 bg-white/80 rounded-full px-4 py-2 flex-row items-center border-2 border-gray-500">
              <Image
                source={{
                  uri: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/safari-ball.png",
                }}
                className="w-6 h-6 mr-2"
              />
              <Text className="font-bold text-lg">{safariBalls}</Text>
            </View>

            <View className="bg-white rounded-lg p-3 h-24 justify-center border-4 border-gray-300">
              <Text className="text-lg" style={{ fontFamily: "DungGeunMo" }}>
                {message}
              </Text>
              {/* 1. 게임 종료 시 다음으로 넘어가는 안내 메시지 */}
              {isGameEnd && (
                <Text className="absolute bottom-1 right-2 text-xs text-gray-500">
                  아무 곳이나 눌러서 닫기...
                </Text>
              )}
            </View>

            {/* 1. 게임 종료 시에는 버튼을 숨깁니다. */}
            {!isGameEnd && (
              <View className="flex-row gap-2 mt-2">
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
                  onPress={runAway}
                  disabled={!isActionable}
                />
              </View>
            )}
          </View>
        </ImageBackground>
      </Pressable>
    </Modal>
  );
}
