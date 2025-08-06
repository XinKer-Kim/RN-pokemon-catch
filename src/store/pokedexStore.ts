// /src/store/pokedexStore.ts

import { create } from "zustand";

// 도감 스토어의 상태 타입
interface PokedexState {
  caughtPokemonIds: Set<string>; // 중복을 허용하지 않는 Set 자료구조 사용
  addCaughtPokemon: (id: string) => void;
}

export const usePokedexStore = create<PokedexState>((set) => ({
  // 초기 상태: 처음에는 아무것도 잡지 않았습니다.
  caughtPokemonIds: new Set(),

  // 잡은 포켓몬 ID를 Set에 추가하는 액션
  addCaughtPokemon: (id) => {
    // 상태 업데이트 시, 이전 상태를 포함하여 새로운 상태 객체를 반환합니다.
    set((state) => {
      // 기존 Set을 복사하여 새로운 Set을 만듭니다 (불변성 유지).
      const newCaughtPokemonIds = new Set(state.caughtPokemonIds);
      // 새로운 Set에 ID를 추가합니다.
      newCaughtPokemonIds.add(id);
      // 이전 상태(...state)와 변경된 속성을 함께 반환하여 안정성을 높입니다.
      return { ...state, caughtPokemonIds: newCaughtPokemonIds };
    });
  },
}));
