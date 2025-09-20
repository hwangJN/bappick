import type { MenuItem } from "@/src/state/types";
import { ClayColors, ClayShadow } from "@/src/styles/clay";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  item?: MenuItem;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

export function MenuCard({ item, isFavorite, onToggleFavorite }: Props) {
  const entryScale = React.useRef(new Animated.Value(0.92)).current;
  const entryOpacity = React.useRef(new Animated.Value(0)).current;
  const entryTranslate = React.useRef(new Animated.Value(8)).current;
  const pressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!item) return;
    entryScale.setValue(0.92);
    entryOpacity.setValue(0);
    entryTranslate.setValue(8);
    Animated.parallel([
      Animated.timing(entryOpacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.spring(entryScale, {
        toValue: 1,
        friction: 6,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.spring(entryTranslate, {
        toValue: 0,
        friction: 6,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [item?.id]);

  if (!item) return null;
  const pressScale = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.97],
  });
  return (
    <Pressable
      onPressIn={() =>
        Animated.spring(pressAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
        }).start()
      }
      onPressOut={() =>
        Animated.spring(pressAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
        }).start()
      }
    >
      <Animated.View
        style={[
          styles.shadow,
          {
            transform: [
              { translateY: entryTranslate },
              { scale: Animated.multiply(entryScale, pressScale) },
            ],
            opacity: entryOpacity,
          },
        ]}
      >
        <View style={styles.ring} />
        <LinearGradient
          colors={[ClayColors.cardFrom, ClayColors.cardTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.topRow}>
            <View />
            <Pressable hitSlop={10} onPress={onToggleFavorite}>
              <Text
                style={[
                  styles.star,
                  isFavorite ? styles.starActive : undefined,
                ]}
              >
                {isFavorite ? "★" : "☆"}
              </Text>
            </Pressable>
          </View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: { ...ClayShadow.outer, borderRadius: 24, overflow: "visible" },
  card: {
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: "center",
    width: "100%",
  },
  topRow: {
    position: "absolute",
    top: 12,
    right: 12,
    left: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: { fontSize: 32, fontWeight: "800", marginBottom: 6, color: "#1C1C1E" },
  category: { fontSize: 14, color: "#8E8E93" },
  star: { fontSize: 22, color: "#C7C7CC" },
  starActive: { color: "#FFCC00" },
  ring: {
    position: "absolute",
    top: -4,
    bottom: -4,
    left: -4,
    right: -4,
    borderRadius: 32,
    backgroundColor: "rgba(126,161,255,0.08)",
  },
});
