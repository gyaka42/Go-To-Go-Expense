import { ThemeColors } from "@/constants/theme";
import { useTheme } from "@/contexts/themeContext";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const Index = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("../assets/images/splashImage.png")}
      />
    </View>
  );
};

export default Index;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.appBackground,
    },
    logo: {
      height: "20%",
      aspectRatio: 1,
    },
  });
