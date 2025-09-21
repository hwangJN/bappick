import { ClayColors, ClayShadow } from "@/src/styles/clay";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onUpdate: () => void;
  onCancel: () => void;
};

export default function OtaUpdateModal({ visible, onUpdate, onCancel }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, ClayShadow.outer]}>
          <LinearGradient
            colors={[ClayColors.cardFrom, ClayColors.cardTo]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.title}>업데이트가 있어요</Text>
            <Text style={styles.body}>
              최신 개선사항을 받으려면 업데이트를 진행해주세요.
            </Text>
            <View style={styles.row}>
              <Pressable style={[styles.secondaryBtn]} onPress={onCancel}>
                <Text style={styles.secondaryLabel}>나중에</Text>
              </Pressable>
              <Pressable
                style={[styles.primaryBtn, ClayShadow.outer]}
                onPress={onUpdate}
              >
                <Text style={styles.primaryLabel}>업데이트</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  card: { borderRadius: 20, overflow: "hidden" },
  gradient: { padding: 20 },
  title: { fontSize: 18, fontWeight: "800", color: ClayColors.text },
  body: { fontSize: 14, color: ClayColors.text, marginTop: 8 },
  row: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ClayColors.border,
    backgroundColor: "#fff",
  },
  secondaryLabel: { color: ClayColors.text },
  primaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: ClayColors.primaryFrom,
  },
  primaryLabel: { color: ClayColors.primaryText, fontWeight: "800" },
});
