import { useAppStore } from "@/src/state/useAppStore";
import { Link } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Categories are now dynamic from store

export default function SettingsScreen() {
  const {} = useAppStore();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>설정</Text>

        {/* 카테고리 선택은 Home으로 이동 */}

        {/* 필터 섹션 제거, 데이터 관리만 유지 */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>음식 리스트 관리</Text>
          <Link href="/manage" asChild>
            <Text style={styles.link}>음식 리스트 관리하기 →</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  container: { padding: 20, gap: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  label: { fontSize: 16, color: "#111827" },
  link: { color: "#2563EB", fontWeight: "600" },
});
