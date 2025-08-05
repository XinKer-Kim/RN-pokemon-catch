import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DungGeunMo: require("../assets/fonts/DungGeunMo.ttf"),
  });
  if (!fontsLoaded) return null;
  return <Stack />;
}
