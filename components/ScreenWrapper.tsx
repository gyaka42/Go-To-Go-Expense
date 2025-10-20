import { useTheme } from "@/contexts/themeContext";
import { ScreenWrapperProps } from "@/types";
import React from "react";
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({
  style,
  children,
  statusBarBackgroundColor,
}: ScreenWrapperProps) => {
  let paddingTop = Platform.OS === "ios" ? height * 0.06 : 50;
  const { colors, isDarkMode } = useTheme();
  const flattenedStyle = StyleSheet.flatten(style);
  const wrapperBackground =
    flattenedStyle?.backgroundColor ?? colors.appBackground;
  const statusBarColor = statusBarBackgroundColor ?? wrapperBackground;
  return (
    <View
      style={[
        {
          paddingTop,
          flex: 1,
          backgroundColor: wrapperBackground,
        },
        style,
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={statusBarColor}
      />
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
