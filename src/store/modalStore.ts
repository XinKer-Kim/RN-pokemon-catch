import { DisplayPokemonData } from "@/src/components/card/PokemonCard"; // PokemonCard에서 사용하던 타입 재활용
import { create } from "zustand";

// 스토어의 상태(state) 타입을 정의합니다.
interface ModalState {
  isVisible: boolean;
  pokemonData: DisplayPokemonData | null;
  openModal: (data: DisplayPokemonData) => void;
  closeModal: () => void;
}

// 스토어를 생성합니다.
export const useModalStore = create<ModalState>((set) => ({
  // 초기 상태
  isVisible: false,
  pokemonData: null,

  // 상태를 변경하는 액션(함수)들
  openModal: (data) => set({ isVisible: true, pokemonData: data }),
  closeModal: () => set({ isVisible: false, pokemonData: null }),
}));
