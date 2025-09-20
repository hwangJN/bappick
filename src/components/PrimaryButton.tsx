import { ClayColors, ClayShadow } from "@/src/styles/clay";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, style }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.wrapper,
        style,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={[ClayColors.primaryFrom, ClayColors.primaryTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { ...ClayShadow.outer, borderRadius: 24 },
  button: {
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    shadowRadius: 12,
    shadowOpacity: 0.2,
  },
  label: { color: ClayColors.primaryText, fontSize: 16, fontWeight: "700" },
});
