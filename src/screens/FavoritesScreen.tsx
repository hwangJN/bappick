import { EmptyState } from "@/src/components/EmptyState";
import { MenuCard } from "@/src/components/MenuCard";
import { useAppStore } from "@/src/state/useAppStore";
import { ClayColors } from "@/src/styles/clay";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesScreen() {
  const { menus, favorites, toggleFavorite } = useAppStore();
  const items = menus.filter((m) => favorites.includes(m.id));

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* <StatusBarFill /> */}
      <LinearGradient
        colors={[ClayColors.bgFrom, ClayColors.bgTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>즐겨찾기</Text>
          {items.length === 0 ? (
            <EmptyState
              title="저장된 즐겨찾기가 없어요"
              subtitle="추천에서 ⭐︎를 눌러 저장해보세요"
            />
          ) : (
            <FlatList
              removeClippedSubviews={false}
              style={{ overflow: "visible" }}
              contentContainerStyle={{
                paddingVertical: 12,
                gap: 12,
                paddingBottom: 88,
              }}
              showsVerticalScrollIndicator={false}
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MenuCard
                  item={item}
                  isFavorite={true}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                />
              )}
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: ClayColors.bgFrom },
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
    paddingBottom: 16,
  },
});
