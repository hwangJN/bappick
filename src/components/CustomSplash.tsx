import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

type Props = { visible: boolean };

export default function CustomSplash({ visible }: Props) {
  const opacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible && (opacity as any)._value === 0) return null;
  //    (#A7D8F5 → #E0F7FF).

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[StyleSheet.absoluteFillObject, { opacity, zIndex: 1000 }]}
    >
      <LinearGradient
        colors={["#E0F7FF", "#89c5dd"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.center}>
        <Image
          source={require("@/assets/images/bappick-splash.png")}
          style={styles.logo}
        />
        {/* <View style={styles.logo} />
        <Text style={styles.title}>오늘 뭐 먹지</Text> */}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: {
    width: 104,
    height: 104,
    borderRadius: 30,
    backgroundColor: "#7EA1FF",
    shadowColor: "#8FA2FF",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  title: { marginTop: 18, fontSize: 18, fontWeight: "800", color: "#1C1C1E" },
});
