import { Select } from "@/src/components/Select";
import { useAppStore } from "@/src/state/useAppStore";
// import { Stack } from "expo-router";
import { ClayColors, ClayShadow } from "@/src/styles/clay";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ManageScreen() {
  const {
    userMenus,
    menus,
    addMenu,
    updateMenu,
    deleteAnyMenu,
    getAllCategories,
    removedIds,
  } = useAppStore();
  const all = React.useMemo(
    () => [...userMenus, ...menus].filter((m) => !removedIds.includes(m.id)),
    [userMenus, menus, removedIds]
  );
  const categories = useAppStore.getState().getAllCategoriesForInput();

  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState(categories[0] ?? "한식");
  // 필터 제거에 따라 돼지고기 토글도 제거

  const onAdd = () => {
    if (!name.trim()) return;
    addMenu({ name: name.trim(), category });
    setName("");
    // nothing else to reset
  };

  return (
    <>
      <SafeAreaView style={[styles.safe, { paddingBottom: 0 }]} edges={["top"]}>
        {/* <StatusBarFill /> */}
        <LinearGradient
          colors={[ClayColors.bgFrom, ClayColors.bgTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          {/* <View style={styles.topbar}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <IconSymbol size={24} name="chevron.left" color="#111827" />
          </Pressable>
        </View> */}
          <View style={styles.container}>
            {/* <Text style={styles.title}>음식 리스트 관리</Text> */}

            <View style={[styles.section, ClayShadow.outer]}>
              <Text style={styles.sectionTitle}>음식 추가하기</Text>
              <View style={styles.pickerRow}>
                <Text style={styles.label}>카테고리</Text>
                <Select
                  value={category}
                  options={categories}
                  onChange={setCategory}
                />
              </View>
              <TextInput
                placeholder="이름"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              {/* 돼지고기 포함 토글 제거 */}
              <Pressable
                style={[styles.primaryBtn, ClayShadow.outer]}
                onPress={onAdd}
              >
                <Text style={styles.primaryBtnLabel}>추가</Text>
              </Pressable>
            </View>

            <View
              style={[styles.section, styles.sectionList, ClayShadow.outer]}
            >
              <Text style={styles.sectionTitle}>전체 음식 목록</Text>
              <FlatList
                data={all}
                keyExtractor={(item) => item.id}
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingVertical: 4,
                  paddingBottom: 88,
                }}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.divider} />}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemMeta}>{item.category}</Text>
                    </View>
                    <Pressable
                      style={styles.iconGhostBtn}
                      onPress={() => deleteAnyMenu(item.id)}
                      hitSlop={8}
                    >
                      <MaterialIcons name="close" size={20} color="#8E8E93" />
                    </Pressable>
                  </View>
                )}
              />
            </View>
          </View>
          <View pointerEvents="none" style={styles.versionWrap}>
            <Text style={styles.versionText}>
              v{Constants.expoConfig?.version ?? "1.0.0"}
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: ClayColors.bgFrom },
  topbar: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 6 },
  container: { flex: 1, padding: 20, paddingBottom: 8, gap: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#1C1C1E" },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  sectionTitle: {
    fontSize: 20,
    paddingTop: 4,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  sectionList: { flex: 1, minHeight: 0, overflow: "hidden" },
  divider: { height: 10 },
  input: {
    backgroundColor: "#FFFFFF",
    color: "#1C1C1E",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { color: "#1C1C1E" },
  pickerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  // Select 컴포넌트가 자체 스타일을 가짐
  primaryBtn: {
    backgroundColor: "#7EA1FF",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
  },
  primaryBtnLabel: { color: "#FFFFFF", fontWeight: "700" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  itemName: { color: "#1C1C1E", fontWeight: "600" },
  itemMeta: { color: "#8E8E93", marginTop: 2 },
  iconGhostBtn: { paddingVertical: 6, paddingHorizontal: 6, borderRadius: 10 },
  builtInTag: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  builtInTagLabel: { color: "#00131A", fontWeight: "800" },
  versionWrap: {
    // position: "absolute",
    // left: 0,
    // right: 0,
    // bottom: 8,
    alignItems: "center",
  },
  versionText: { fontSize: 11, marginBottom: 4, color: "#8E8E93" },
});
