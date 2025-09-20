import React from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  value?: string;
  options: string[];
  placeholder?: string;
  onChange: (next: string) => void;
};

export function Select({
  value,
  options,
  placeholder = "선택",
  onChange,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const close = () => setOpen(false);
  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <>
      <Pressable style={styles.button} onPress={() => setOpen(true)}>
        <Text style={[styles.valueText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
      </Pressable>
      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable style={styles.backdrop} onPress={close}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
              renderItem={({ item }) => (
                <Pressable style={styles.option} onPress={() => choose(item)}>
                  <Text style={styles.optionText}>{item}</Text>
                  {value === item ? <Text style={styles.check}>✓</Text> : null}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  valueText: { color: "#111827" },
  placeholder: { color: "#9CA3AF" },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.24)",
    padding: 20,
    justifyContent: "center",
  },
  sheet: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    maxHeight: "70%",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111827",
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: { color: "#111827", fontWeight: "500" },
  check: { color: "#2563EB", fontWeight: "700" },
});
