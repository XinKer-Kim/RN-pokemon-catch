// /src/constants/pokemonTypes.t

interface TypeInfo {
  koreanName: string;
  color: string;
}

// {[key: string]: TypeInfo} 는 '문자열을 키로 갖고 TypeInfo를 값으로 갖는 객체'라는 의미입니다.
export const typeDetails: { [key: string]: TypeInfo } = {
  normal: { koreanName: "노말", color: "#A8A77A" },
  fire: { koreanName: "불꽃", color: "#EE8130" },
  water: { koreanName: "물", color: "#6390F0" },
  electric: { koreanName: "전기", color: "#F7D02C" },
  grass: { koreanName: "풀", color: "#7AC74C" },
  ice: { koreanName: "얼음", color: "#96D9D6" },
  fighting: { koreanName: "격투", color: "#C22E28" },
  poison: { koreanName: "독", color: "#A33EA1" },
  ground: { koreanName: "땅", color: "#E2BF65" },
  flying: { koreanName: "비행", color: "#A98FF3" },
  psychic: { koreanName: "에스퍼", color: "#F95587" },
  bug: { koreanName: "벌레", color: "#A6B91A" },
  rock: { koreanName: "바위", color: "#B6A136" },
  ghost: { koreanName: "고스트", color: "#735797" },
  dragon: { koreanName: "드래곤", color: "#6F35FC" },
  dark: { koreanName: "악", color: "#705746" },
  steel: { koreanName: "강철", color: "#B7B7CE" },
  fairy: { koreanName: "페어리", color: "#D685AD" },
};
