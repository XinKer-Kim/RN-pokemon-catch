// /src/store/modalStore.ts

import { DisplayPokemonData } from "@/src/components/card/PokemonCard"; // PokemonCard에서 export한 타입
import { create } from "zustand";

// 게임 상태를 나타내는 타입
type GameStatus = "ENCOUNTER" | "THROWING_BALL" | "CAUGHT" | "FLED" | "FAIL";

// 스토어의 전체 상태 타입
interface ModalState {
  isVisible: boolean;
  pokemonData: DisplayPokemonData | null;
  gameStatus: GameStatus;
  message: string;
  catchRateModifier: number;
  fleeRateModifier: number;
  openModal: (data: DisplayPokemonData) => void;
  closeModal: () => void;
  throwBall: () => void;
  throwBait: () => void;
  throwMud: () => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  // --- 초기 상태 ---
  isVisible: false,
  pokemonData: null,
  gameStatus: "ENCOUNTER",
  message: "",
  catchRateModifier: 1.0,
  fleeRateModifier: 1.0,

  // --- 액션 (상태 변경 함수) ---
  openModal: (data) => {
    set({
      isVisible: true,
      pokemonData: data,
      gameStatus: "ENCOUNTER",
      message: `야생의 ${data.koreanName}이(가) 나타났다!`,
      catchRateModifier: 1.0,
      fleeRateModifier: 1.0,
    });
  },

  closeModal: () => {
    set({ isVisible: false, pokemonData: null });
  },

  throwBall: () => {
    const { pokemonData, catchRateModifier } = get();
    if (!pokemonData) return;

    set({
      gameStatus: "THROWING_BALL",
      message: `${pokemonData.koreanName}에게 볼을 던졌다...`,
    });

    // 포획률 계산 (포켓몬스터 게임의 실제 공식을 단순화)
    const catchChance = Math.min(
      1,
      (pokemonData.baseCaptureRate / 255) * catchRateModifier
    );
    const isCaught = Math.random() < catchChance;

    setTimeout(() => {
      if (isCaught) {
        set({
          gameStatus: "CAUGHT",
          message: `やったー！ ${pokemonData.koreanName}을(를) 잡았다!`,
        });
      } else {
        set({
          gameStatus: "FAIL",
          message: "아... 조금만 더하면 잡을 수 있었는데!",
        });
        // 실패 시 도망갈 수 있음
        get().checkFlee();
      }
    }, 2000); // 2초 후 결과 표시
  },

  throwBait: () => {
    const { pokemonData } = get();
    if (!pokemonData) return;

    set((state) => ({
      catchRateModifier: Math.max(0.1, state.catchRateModifier * 0.5), // 잡기 어려워짐
      fleeRateModifier: Math.max(0.1, state.fleeRateModifier * 0.5), // 도망갈 확률 감소
      message: `${pokemonData.koreanName}은(는) 먹이를 맛있게 먹고 있다.`,
    }));
    get().checkFlee();
  },

  throwMud: () => {
    const { pokemonData } = get();
    if (!pokemonData) return;

    set((state) => ({
      catchRateModifier: Math.min(3.0, state.catchRateModifier * 1.5), // 잡기 쉬워짐
      fleeRateModifier: Math.min(3.0, state.fleeRateModifier * 1.5), // 도망갈 확률 증가
      message: `${pokemonData.koreanName}은(는) 화가 나서 날뛰고 있다!`,
    }));
    get().checkFlee();
  },

  // 내부 로직: 도망 여부 체크
  checkFlee: () => {
    const { fleeRateModifier, gameStatus } = get();
    if (gameStatus === "CAUGHT" || gameStatus === "FLED") return;

    const fleeChance = Math.min(0.8, 0.1 * fleeRateModifier); // 기본 10%에서 변동
    const didFlee = Math.random() < fleeChance;

    setTimeout(() => {
      if (didFlee) {
        set({
          gameStatus: "FLED",
          message: "앗! 야생 포켓몬은 도망가버렸다...",
        });
      } else {
        // 도망가지 않으면 다시 행동 선택 가능
        set({ gameStatus: "ENCOUNTER" });
      }
    }, 1500);
  },
}));
