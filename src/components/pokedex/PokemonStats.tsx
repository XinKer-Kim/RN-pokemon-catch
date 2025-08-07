// /src/components/pokedex/PokemonStats.tsx

import { Text, View } from "react-native";
import Svg, { Line, Polygon, Text as SvgText } from "react-native-svg";

// 스탯 정보를 위한 타입
interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface PokemonStatsProps {
  stats: Stat[];
  colorName: string;
}
// 1. API에서 주는 색상 이름을 16진수 코드로 변환하기 위한 맵(map) 객체
const colorNameToHex: { [key: string]: string } = {
  black: "#000000",
  blue: "#6390F0",
  brown: "#A38C5A",
  gray: "#A8A77A",
  green: "#7AC74C",
  pink: "#D685AD",
  purple: "#A33EA1",
  red: "#EE8130",
  white: "#F8F8F8",
  yellow: "#F7D02C",
};

// 2. 16진수 색상 코드를 RGBA로 변환하는 헬퍼 함수 (재도입)
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// 스탯 이름, 라벨, 색상 매핑
const statDetails: {
  [key: string]: { label: string; shortLabel: string; color: string };
} = {
  hp: { label: "체력", shortLabel: "HP", color: "#FF5959" },
  attack: { label: "공격", shortLabel: "ATK", color: "#F5AC78" },
  defense: { label: "방어", shortLabel: "DEF", color: "#FAE078" },
  "special-attack": {
    label: "특수공격",
    shortLabel: "Sp.A",
    color: "#9DB7F5",
  },
  "special-defense": {
    label: "특수방어",
    shortLabel: "Sp.D",
    color: "#A7DB8D",
  },
  speed: { label: "스피드", shortLabel: "SPD", color: "#FA82F2" },
};

// 육각형 레이더 차트 컴포넌트
const StatRadarChart = ({
  stats,
  colorName,
}: {
  stats: Stat[];
  colorName: string;
}) => {
  console.log(colorName);
  const chartSize = 140; // 육각형 그래프 자체의 크기
  const svgSize = chartSize + 60; // 라벨을 포함할 전체 SVG 캔버스 크기 (좌우 패딩 30씩 추가)
  const svgCenter = svgSize / 2; // SVG 캔버스의 중심점
  const chartRadius = chartSize / 2; // 육각형 그래프의 반지름
  const labelOffset = 20; // 라벨이 그래프에서 떨어지는 거리
  const maxStatValue = 150; // 그래프 스케일의 기준이 될 스탯 최대값
  const hexColor = colorNameToHex[colorName] || "#A8A77A";
  // 라벨과 스탯 순서를 고정하기 위한 배열
  const statOrder = [
    "hp",
    "attack",
    "defense",
    "speed",
    "special-defense",
    "special-attack",
  ];

  // API에서 받은 스탯을 고정된 순서로 정렬합니다.
  const sortedStats = [...stats].sort((a, b) => {
    return statOrder.indexOf(a.stat.name) - statOrder.indexOf(b.stat.name);
  });

  // 스탯 값에 따른 다각형의 각 꼭짓점 좌표를 계산합니다.
  const statPoints = sortedStats
    .map((stat, i) => {
      const value = stat.base_stat;
      const angle = (Math.PI / 3) * i - Math.PI / 2; // 0번 인덱스(HP)가 위로 가도록 각도 조정
      const statRatio = Math.min(value, maxStatValue) / maxStatValue;
      // 2. 모든 좌표 계산의 기준점을 svgCenter로 변경합니다.
      const x = svgCenter + chartRadius * statRatio * Math.cos(angle);
      const y = svgCenter + chartRadius * statRatio * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  // 배경 가이드라인과 라벨을 렌더링하는 함수
  const renderGuidesAndLabels = () => {
    const elements = [];
    // 1. 동심원 육각형 (척도)
    for (let scale = 1; scale <= 2; scale++) {
      // 2개의 척도선 (50, 100)
      const scaleRatio = scale / 2;
      const scalePoints = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const x = svgCenter + chartRadius * scaleRatio * Math.cos(angle);
        const y = svgCenter + chartRadius * scaleRatio * Math.sin(angle);
        return `${x},${y}`;
      }).join(" ");
      elements.push(
        <Polygon
          points={statPoints}
          fill={hexToRgba(hexColor, 0.6)} // fill은 투명도를 줍니다.
          fillOpacity="0.6"
          stroke={hexColor} //
          strokeWidth="2"
        />
      );
    }

    // 2. 각 꼭짓점의 라벨과 중심선
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const x_outer = svgCenter + chartRadius * Math.cos(angle);
      const y_outer = svgCenter + chartRadius * Math.sin(angle);
      // 중심에서 꼭짓점으로 선 긋기
      elements.push(
        <Line
          key={`line-${i}`}
          x1={svgCenter}
          y1={svgCenter}
          x2={x_outer}
          y2={y_outer}
          stroke={"#e5e7eb"}
          strokeWidth="2"
        />
      );

      // 라벨 위치 계산 (꼭짓점보다 약간 바깥쪽)
      const label_x = svgCenter + (chartRadius + labelOffset) * Math.cos(angle);
      const label_y = svgCenter + (chartRadius + labelOffset) * Math.sin(angle);
      const statName = sortedStats[i]?.stat.name || "";
      const detail = statDetails[statName];

      elements.push(
        <SvgText
          key={`label-${i}`}
          x={label_x}
          y={label_y}
          fontSize="12"
          fontWeight="bold"
          fill="#6b7280"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {detail ? detail.shortLabel : ""}
        </SvgText>
      );
    }
    return elements;
  };

  return (
    <View className="items-center justify-center">
      {/* 3. SVG 캔버스 크기를 동적으로 설정 */}
      <Svg height={svgSize} width={svgSize}>
        {renderGuidesAndLabels()}
        {/* 스탯 값에 따른 실제 능력치 다각형 */}
        <Polygon
          points={statPoints}
          fill={hexToRgba(hexColor, 0.6)}
          stroke={hexColor}
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};

// 개별 스탯 바 컴포넌트
const StatBar = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => {
  const maxStatValue = 200;
  const barWidth = Math.min((value / maxStatValue) * 100, 100);

  return (
    <View className="flex-row items-center my-1">
      <Text className="w-20 text-gray-500 font-bold text-xs">{label}</Text>
      <Text className="w-8 font-bold text-xs">{value}</Text>
      <View className="flex-1 bg-gray-200 rounded-full h-2.5">
        <View
          style={{ width: `${barWidth}%`, backgroundColor: color }}
          className="h-2.5 rounded-full"
        />
      </View>
    </View>
  );
};

export const PokemonStats = ({ stats, colorName }: PokemonStatsProps) => {
  // 스탯 순서 고정
  const statOrder = [
    "hp",
    "attack",
    "defense",
    "special-attack",
    "special-defense",
    "speed",
  ];
  const sortedStats = [...stats].sort((a, b) => {
    return statOrder.indexOf(a.stat.name) - statOrder.indexOf(b.stat.name);
  });

  return (
    <View className="mt-4 w-full">
      <Text className="text-xl font-bold text-center mb-2">능력치</Text>

      <StatRadarChart stats={sortedStats} colorName={colorName} />

      <View className="w-full mt-4">
        {sortedStats.map((statItem) => {
          const detail = statDetails[statItem.stat.name];
          if (!detail) return null;
          return (
            <StatBar
              key={statItem.stat.name}
              label={detail.label}
              value={statItem.base_stat}
              color={detail.color}
            />
          );
        })}
      </View>
    </View>
  );
};
