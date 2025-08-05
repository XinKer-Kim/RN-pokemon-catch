import React from "react";
import { Image, View } from "react-native";

export function AppHeader() {
  return (
    <View className="w-full h-12     bg-white">
      <Image
        source={require("@/assets/images/logo.png")}
        className={"w-32 h-full object-contain mx-auto"}
      />
    </View>
  );
}
