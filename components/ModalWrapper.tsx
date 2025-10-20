import { spacingY } from "@/constants/theme";
import { useTheme } from "@/contexts/themeContext";
import { ModalWrapperProps } from "@/types";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const isIos = Platform.OS === "ios";

const ModalWrapper = ({ style, children, bg }: ModalWrapperProps) => {
  const { colors } = useTheme();
  const backgroundColor = bg ?? colors.cardBackground;
  return (
    <View style={[styles.container, { backgroundColor }, style && style]}>
      {children}
    </View>
  );
};

export default ModalWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isIos ? spacingY._15 : 50,
    paddingBottom: isIos ? spacingY._20 : spacingY._10,
  },
});
