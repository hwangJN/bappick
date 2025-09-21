import { CategoryChips } from "@/src/components/CategoryChips";
import { MenuCard } from "@/src/components/MenuCard";
import { NiceAlert } from "@/src/components/NiceAlert";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { useAppStore } from "@/src/state/useAppStore";
import { ClayColors } from "@/src/styles/clay";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const {
    isLoaded,
    loadSeed,
    pickMenu,
    favorites,
    toggleFavorite,
    settings,
    setCategories,
  } = useAppStore();
  const categories = useAppStore.getState().getAllCategories();
  const sortedCategories = React.useMemo(() => {
    const PRIORITY = ["한식", "중식", "일식", "양식"] as const;
    const rank = new Map(PRIORITY.map((v, i) => [v as string, i]));
    return [...categories].sort((a, b) => {
      const ai = rank.has(a) ? (rank.get(a) as number) : Infinity;
      const bi = rank.has(b) ? (rank.get(b) as number) : Infinity;
      if (ai !== bi) return ai - bi;
      return a.localeCompare(b, "ko");
    });
  }, [categories]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [current, setCurrent] = React.useState<ReturnType<typeof pickMenu>>(
    () => undefined
  );

  React.useEffect(() => {
    if (!isLoaded) void loadSeed();
  }, [isLoaded, loadSeed]);

  const onPick = () => {
    const item = pickMenu();
    if (!item) {
      setShowAlert(true);
      return;
    }
    setCurrent(item);
  };
  // console.log(categories);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      {/* <StatusBarFill /> */}
      <LinearGradient
        colors={[ClayColors.bgFrom, ClayColors.bgTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>오늘 뭐 먹지?</Text>
          <View style={{ height: 12 }} />
          <CategoryChips
            categories={sortedCategories}
            selected={settings.categories}
            onChange={setCategories}
          />
          {current && <View style={{ height: 20 }} />}
          <MenuCard
            item={current}
            isFavorite={current ? favorites.includes(current.id) : false}
            onToggleFavorite={() => current && toggleFavorite(current.id)}
          />
          <View style={{ height: 24 }} />
          <PrimaryButton
            label={current ? "다시 추천받기" : "추천받기"}
            onPress={onPick}
          />
        </View>
      </LinearGradient>
      <NiceAlert
        visible={showAlert}
        title="선택 필요"
        message="카테고리를 한 개 이상 선택해주세요"
        confirmText="확인"
        onClose={() => setShowAlert(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: ClayColors.bgFrom },
  container: { flex: 1, padding: 20, gap: 16, justifyContent: "flex-start" },
  title: { fontSize: 28, fontWeight: "700", color: "#1C1C1E" },
  subtitle: { fontSize: 14, color: "#8E8E93" },
});
