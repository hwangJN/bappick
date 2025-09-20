import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  categories: string[];
  selected: string[];
  onChange: (next: string[]) => void;
};

export function CategoryChips({ categories, selected, onChange }: Props) {
  const toggle = (c: string) => {
    const exists = selected.includes(c);
    const next = exists ? selected.filter((v) => v !== c) : [...selected, c];
    onChange(next);
  };

  return (
    <View style={styles.row}>
      {categories.map((c) => {
        const active = selected.includes(c);
        return (
          <Pressable
            key={c}
            onPress={() => toggle(c)}
            style={[styles.chip, active && styles.active]}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>
              {c}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  active: {
    backgroundColor: "#E6F0FF",
    borderColor: "#C7E0FF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  label: { color: "#1C1C1E" },
  activeLabel: { color: "#007AFF", fontWeight: "600" },
});
