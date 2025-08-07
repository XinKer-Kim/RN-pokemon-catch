// /src/store/profileStore.ts

import { create } from "zustand";

// 프로필 스토어의 상태 타입
// 프로필 스토어의 상태 타입
interface ProfileState {
  username: string;
  avatarId: string;
  bio: string;
  setUsername: (name: string) => void;
  setAvatarId: (id: string) => void;
  setBio: (bio: string) => void; // 자기소개 수정 액션 추가
}

export const useProfileStore = create<ProfileState>((set) => ({
  // 초기 상태
  username: "신참 트레이너",
  avatarId: "25", // 기본 아바타는 피카츄!
  bio: "관동지방을 여행하는 신참 트레이너입니다.",

  // 프로필 정보를 업데이트하는 액션들
  setUsername: (name) => set({ username: name }),
  setAvatarId: (id) => set({ avatarId: id }),
  setBio: (bio) => set({ bio: bio }), // 자기소개 수정 액션 구현
}));
