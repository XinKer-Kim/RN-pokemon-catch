import { PokemonDetailModal } from "@/src/components/modal/PokemonDetailModal";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import "./global.css";

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#4CAF50", // Primary color
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DungGeunMo: require("../assets/fonts/DungGeunMo.ttf"),
  });
  if (!fontsLoaded) return null;
  return (
    <ThemeProvider value={appTheme}>
      <SafeAreaView className="w-full h-full">
        <Slot />
        <PokemonDetailModal />
      </SafeAreaView>
    </ThemeProvider>
  );
}
