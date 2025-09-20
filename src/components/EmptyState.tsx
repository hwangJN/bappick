import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = { title: string; subtitle?: string };

export function EmptyState({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 48 },
  title: { fontSize: 16, color: "#8E8E93" },
  subtitle: {
    fontSize: 14,
    color: "#C7C7CC",
    marginTop: 6,
    textAlign: "center",
  },
});
