import { ThemeColors, radius } from "@/constants/theme";
import { useTheme } from "@/contexts/themeContext";
import { BackButtonProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { CaretCircleLeftIcon } from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const BackButton = ({ style, iconSize = 26 }: BackButtonProps) => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[styles.button, style]}
    >
      <CaretCircleLeftIcon
        size={verticalScale(iconSize)}
        color={colors.text}
        weight="duotone"
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    button: {
      backgroundColor: colors.neutral600,
      alignSelf: "flex-start",
      borderRadius: radius._15,
      borderCurve: "continuous",
      padding: 5,
    },
  });
