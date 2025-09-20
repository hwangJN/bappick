import { ClayColors } from "@/src/styles/clay";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StatusBarFill() {
  const { top } = useSafeAreaInsets();

  return (
    <>
      {/* Android: 실제 StatusBar 배경색 지정 */}
      <StatusBar backgroundColor={ClayColors.dangerTo} style="dark" />
      {/* iOS: StatusBar 영역을 동일 색/그라데이션으로 채움 */}
      <LinearGradient
        colors={[ClayColors.bgFrom, ClayColors.bgTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: top }}
      />
    </>
  );
}
