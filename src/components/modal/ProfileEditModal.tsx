// /src/components/modal/ProfileEditModal.tsx

import { usePokedexStore } from "@/src/store/pokedexStore";
import { useProfileStore } from "@/src/store/profileStore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileEditModal({ visible, onClose }: ProfileEditModalProps) {
  const { username, bio, avatarId, setUsername, setBio, setAvatarId } =
    useProfileStore();
  const { caughtCounts } = usePokedexStore();

  // 모달 내에서만 사용할 임시 상태
  const [currentUsername, setCurrentUsername] = useState(username);
  const [currentBio, setCurrentBio] = useState(bio);

  // 모달이 열릴 때마다 전역 상태를 로컬 상태로 동기화
  useEffect(() => {
    if (visible) {
      setCurrentUsername(username);
      setCurrentBio(bio);
    }
  }, [visible, username, bio]);

  const handleSave = () => {
    setUsername(currentUsername.trim());
    setBio(currentBio.trim());
    onClose(); // 저장 후 모달 닫기
  };

  const caughtPokemonList = Object.keys(caughtCounts);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-center items-center bg-black/50 p-4">
        <View className="w-full bg-white rounded-2xl p-4 shadow-lg">
          <Text className="text-xl font-bold mb-4">프로필 수정</Text>

          <Text className="font-bold mb-1 text-gray-600">닉네임</Text>
          <TextInput
            value={currentUsername}
            onChangeText={setCurrentUsername}
            className="border border-gray-300 p-2 rounded-lg mb-4"
            placeholder="닉네임을 입력하세요"
          />

          <Text className="font-bold mb-1 text-gray-600">자기소개</Text>
          <TextInput
            value={currentBio}
            onChangeText={setCurrentBio}
            className="border border-gray-300 p-2 rounded-lg mb-4 h-24 text-top"
            placeholder="자기소개를 입력하세요"
            multiline
          />

          <Text className="font-bold mb-2 text-gray-600">아바타 선택</Text>
          <FlatList
            data={caughtPokemonList}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(id) => id}
            renderItem={({ item: id }) => (
              <Pressable
                onPress={() => setAvatarId(id)}
                className={`p-1 rounded-full border-2 ${avatarId === id ? "border-blue-500" : "border-transparent"}`}
              >
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                  }}
                  className="w-16 h-16 bg-gray-100 rounded-full"
                />
              </Pressable>
            )}
            ListEmptyComponent={
              <Text className="text-gray-500">
                포켓몬을 잡으면 아바타를 변경할 수 있어요!
              </Text>
            }
          />

          <View className="flex-row mt-6">
            <Pressable
              onPress={onClose}
              className="flex-1 bg-gray-200 py-3 rounded-lg mr-2"
            >
              <Text className="text-black text-center font-bold">취소</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              className="flex-1 bg-blue-500 py-3 rounded-lg ml-2"
            >
              <Text className="text-white text-center font-bold">저장</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
