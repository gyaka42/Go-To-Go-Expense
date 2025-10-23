import { ThemeColors, spacingX, spacingY } from "@/constants/theme";
import { useTheme } from "@/contexts/themeContext";
import { verticalScale } from "@/utils/styling";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Icons from "phosphor-react-native";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

export default function CustomTabs({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
  const { colors, isDarkMode } = useTheme();
  const styles = React.useMemo(
    () => createStyles(colors, isDarkMode),
    [colors, isDarkMode]
  );
  const isIOS = Platform.OS === "ios";
  const bottomInset = isIOS ? insets.bottom : 0;
  const iosBottomOffset =
    bottomInset > 0 ? Math.max(0, bottomInset - spacingY._15) : spacingY._5;
  const iosContentPadding = bottomInset > 0 ? spacingY._5 : spacingY._7;
  const tabbarIcons: any = React.useMemo(
    () => ({
      index: (isFocused: boolean) => (
        <Icons.HouseSimpleIcon
          size={verticalScale(30)}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primaryLight : colors.neutral400}
        />
      ),
      statistics: (isFocused: boolean) => (
        <Icons.PresentationChartIcon
          size={verticalScale(30)}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primaryLight : colors.neutral400}
        />
      ),
      wallet: (isFocused: boolean) => (
        <Icons.WalletIcon
          size={verticalScale(30)}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primaryLight : colors.neutral400}
        />
      ),
      profile: (isFocused: boolean) => (
        <Icons.UserCircleGearIcon
          size={verticalScale(30)}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primaryLight : colors.neutral400}
        />
      ),
    }),
    [colors]
  );
  return (
    <View
      pointerEvents={isIOS ? "box-none" : "auto"}
      style={
        isIOS
          ? [styles.iosContainer, { bottom: iosBottomOffset }]
          : styles.container
      }
    >
      <View
        style={[
          styles.tabbar,
          isIOS
            ? [
                styles.iosTabbar,
                {
                  paddingHorizontal: spacingX._15,
                  paddingTop: spacingY._5,
                  paddingBottom: iosContentPadding,
                },
              ]
            : [
                styles.androidTabbar,
                { paddingBottom: spacingY._7 + insets.bottom },
              ],
        ]}
      >
        {isIOS && (
          <>
            <BlurView
              pointerEvents="none"
              tint={isDarkMode ? "dark" : "light"}
              intensity={isDarkMode ? 45 : 80}
              style={styles.blurLayer}
            />
            <View pointerEvents="none" style={styles.tintOverlay} />
            <LinearGradient
              pointerEvents="none"
              colors={isDarkMode ? iosDarkGradient : iosLightGradient}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              locations={[0, 0.5, 1]}
              style={styles.glassHighlight}
            />
          </>
        )}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key ?? `${route.name}:${index}`}
              //href={buildHref(route.name, route.params)}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabbarItem}
            >
              {tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const iosLightGradient = [
  "rgba(255, 255, 255, 0.55)",
  "rgba(255, 255, 255, 0.2)",
  "rgba(148, 163, 184, 0.1)",
] as const;

const iosDarkGradient = [
  "rgba(255, 255, 255, 0.12)",
  "rgba(255, 255, 255, 0.04)",
  "rgba(15, 15, 15, 0.4)",
] as const;

const createStyles = (colors: ThemeColors, isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      width: "100%",
    },
    iosContainer: {
      position: "absolute",
      left: spacingX._15,
      right: spacingX._15,
      zIndex: 20,
    },
    tabbar: {
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-around",
      position: "relative",
    },
    iosTabbar: {
      borderRadius: verticalScale(28),
      overflow: "hidden",
      minHeight: verticalScale(56),
      backgroundColor: isDarkMode
        ? "rgba(12, 12, 12, 0.55)"
        : "rgba(255, 255, 255, 0.45)",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDarkMode
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(148, 163, 184, 0.35)",
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 12 },
    },
    androidTabbar: {
      height: verticalScale(52),
      backgroundColor: colors.cardBackground,
      borderTopColor: colors.borderColor,
      borderTopWidth: 1,
      paddingHorizontal: 0,
      justifyContent: "center",
    },
    tabbarItem: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: verticalScale(48),
      zIndex: 1,
    },
    blurLayer: {
      ...StyleSheet.absoluteFillObject,
    },
    tintOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDarkMode
        ? "rgba(20, 20, 20, 0.35)"
        : "rgba(255, 255, 255, 0.25)",
    },
    glassHighlight: {
      ...StyleSheet.absoluteFillObject,
      opacity: isDarkMode ? 0.5 : 0.85,
    },
  });
