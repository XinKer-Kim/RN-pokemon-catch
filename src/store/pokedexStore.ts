// /src/store/pokedexStore.ts

import { create } from "zustand";

// 도감 스토어의 상태 타입
interface PokedexState {
  // 각 포켓몬 ID별로 포획한 횟수를 저장합니다. 예: { '25': 3, '1': 1 }
  caughtCounts: Record<string, number>;
  addCaughtPokemon: (id: string) => void;
}

export const usePokedexStore = create<PokedexState>((set) => ({
  // 초기 상태: 빈 객체로 시작합니다.
  caughtCounts: {},

  // 잡은 포켓몬의 카운트를 1 증가시키는 액션
  addCaughtPokemon: (id) => {
    set((state) => {
      // 현재 포켓몬의 포획 횟수를 가져옵니다. 잡은 적이 없다면 0입니다.
      const currentCount = state.caughtCounts[id] || 0;

      // 새로운 카운트 객체를 생성합니다.
      const newCounts = {
        ...state.caughtCounts, // 기존의 모든 포획 기록을 복사하고
        [id]: currentCount + 1, // 현재 잡은 포켓몬의 카운트만 1 증가시킵니다.
      };

      return { caughtCounts: newCounts };
    });
  },
}));
