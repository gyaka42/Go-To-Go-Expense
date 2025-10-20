import { ThemeColors, radius } from "@/constants/theme";
import { useTheme } from "@/contexts/themeContext";
import { CustomButtonProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Loading from "./Loading";

const Button = ({
  style,
  onPress,
  loading = false,
  children,
}: CustomButtonProps) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  if (loading) {
    return (
      <View style={[styles.button, style, { backgroundColor: "transparent" }]}>
        {/* Loading Component */}
        <Loading />
      </View>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {children}
    </TouchableOpacity>
  );
};

export default Button;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    button: {
      backgroundColor: colors.primaryLight,
      borderRadius: radius._17,
      borderCurve: "continuous",
      justifyContent: "center",
      alignItems: "center",
      height: verticalScale(52),
    },
  });
