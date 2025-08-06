// /src/store/modalStore.ts

import { DisplayPokemonData } from "@/src/components/card/PokemonCard";
import { create } from "zustand";
import { usePokedexStore } from "./pokedexStore";

// 게임 상태를 더 명확하게 정의합니다.
type GameStatus =
  | "ENCOUNTER" // 조우 (행동 가능)
  | "PLAYER_ACTION" // 플레이어 행동 처리 중 (행동 불가)
  | "THROWING_BALL" // 볼 던지는 중 (행동 불가)
  | "CAUGHT" // 포획 성공 (게임 종료)
  | "POKEMON_FLED" // 포켓몬 도망 (게임 종료)
  | "PLAYER_FLED"; // 플레이어 도망 (게임 종료)

// 3. 반복 행동에 대한 메시지 목록 추가
const baitMessages = [
  "포켓몬은 먹이를 맛있게 먹고 있다.",
  "포켓몬은 먹이에 정신이 팔려있다!",
  "포켓몬은 경계를 풀고 먹이를 먹는다.",
];

const mudMessages = [
  "포켓몬은 화가 나서 날뛰고 있다!",
  "포켓몬의 몸에 진흙이 명중했다!",
  "포켓몬이 이쪽을 매섭게 째려본다.",
];

// 스토어의 전체 상태 타입
interface ModalState {
  isVisible: boolean;
  pokemonData: DisplayPokemonData | null;
  gameStatus: GameStatus;
  message: string;
  catchRateModifier: number;
  fleeRateModifier: number;
  safariBalls: number;
  openModal: (data: DisplayPokemonData) => void;
  closeModal: () => void;
  runAway: () => void;
  throwBall: () => void;
  throwBait: () => void;
  throwMud: () => void;
  checkFlee: () => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  // --- 초기 상태 ---
  isVisible: false,
  pokemonData: null,
  gameStatus: "ENCOUNTER",
  message: "",
  catchRateModifier: 1.0,
  fleeRateModifier: 1.0,
  safariBalls: 30,

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

  runAway: () => {
    const { gameStatus } = get();
    if (gameStatus !== "ENCOUNTER") return;
    // 1. 도망 메시지를 보여주고, 게임 종료 상태로 변경 (자동 닫기 제거)
    set({ gameStatus: "PLAYER_FLED", message: "무사히 도망쳤다!" });
  },

  throwBall: () => {
    const { pokemonData, catchRateModifier, gameStatus, safariBalls } = get();
    if (!pokemonData || gameStatus !== "ENCOUNTER") return;

    if (safariBalls <= 0) {
      set({ message: "남은 사파리볼이 없다!" });
      setTimeout(
        () => set({ message: `${pokemonData.koreanName}은(는) 가만히 있다.` }),
        1000
      );
      return;
    }

    set((state) => ({
      safariBalls: state.safariBalls - 1,
      gameStatus: "THROWING_BALL",
      message: `${pokemonData.koreanName}에게 볼을 던졌다...`,
    }));

    const catchChance = Math.min(
      1,
      (pokemonData.baseCaptureRate / 255) * catchRateModifier
    );
    const isCaught = Math.random() < catchChance;

    setTimeout(() => {
      if (isCaught) {
        // 1. 포획 성공 메시지를 보여주고, 게임 종료 상태로 변경 (자동 닫기 제거)
        set({
          gameStatus: "CAUGHT",
          message: `신난다ー！ ${pokemonData.koreanName}을(를) 잡았다!`,
        });
        // 2. 포획 성공 시, 도감 스토어에 잡은 포켓몬 ID를 추가합니다.
        usePokedexStore.getState().addCaughtPokemon(pokemonData.id);
      } else {
        set({ message: "아... 조금만 더하면 잡을 수 있었는데!" });
        get().checkFlee();
      }
    }, 2000);
  },

  throwBait: () => {
    const { pokemonData, gameStatus } = get();
    if (!pokemonData || gameStatus !== "ENCOUNTER") return;

    // 3. 랜덤 메시지 선택
    const randomMessage =
      baitMessages[Math.floor(Math.random() * baitMessages.length)];
    set({ gameStatus: "PLAYER_ACTION", message: randomMessage });

    setTimeout(() => {
      set((state) => ({
        catchRateModifier: Math.max(0.1, state.catchRateModifier * 0.5),
        fleeRateModifier: Math.max(0.1, state.fleeRateModifier * 0.5),
      }));
      get().checkFlee();
    }, 1500);
  },

  throwMud: () => {
    const { pokemonData, gameStatus } = get();
    if (!pokemonData || gameStatus !== "ENCOUNTER") return;

    // 3. 랜덤 메시지 선택
    const randomMessage =
      mudMessages[Math.floor(Math.random() * mudMessages.length)];
    set({ gameStatus: "PLAYER_ACTION", message: randomMessage });

    setTimeout(() => {
      set((state) => ({
        catchRateModifier: Math.min(3.0, state.catchRateModifier * 1.5),
        fleeRateModifier: Math.min(3.0, state.fleeRateModifier * 1.5),
      }));
      get().checkFlee();
    }, 1500);
  },

  checkFlee: () => {
    const { fleeRateModifier } = get();
    const fleeChance = Math.min(0.8, 0.1 * fleeRateModifier);
    const didFlee = Math.random() < fleeChance;

    setTimeout(() => {
      if (didFlee) {
        // 1. 포켓몬 도망 메시지를 보여주고, 게임 종료 상태로 변경 (자동 닫기 제거)
        set({
          gameStatus: "POKEMON_FLED",
          message: "앗! 야생 포켓몬은 도망가버렸다...",
        });
      } else {
        set({ gameStatus: "ENCOUNTER" });
      }
    }, 1500);
  },
}));
