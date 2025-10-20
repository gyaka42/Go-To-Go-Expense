import { ThemeColors, radius, spacingX } from "@/constants/theme";
import { useTheme } from "@/contexts/themeContext";
import { InputProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const Input = (props: InputProps) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  return (
    <View
      style={[styles.container, props.containerStyle && props.containerStyle]}
    >
      {props.icon && props.icon}
      <TextInput
        style={[styles.input, props.inputStyle]}
        placeholderTextColor={colors.neutral400}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  );
};

export default Input;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      height: verticalScale(54),
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: radius._17,
      borderCurve: "continuous",
      paddingHorizontal: spacingX._15,
      gap: spacingX._10,
      backgroundColor: colors.cardBackground,
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: verticalScale(14),
    },
  });
