import { ThemeColors, spacingX, spacingY } from "@/constants/theme";
import { useTheme } from "@/contexts/themeContext";
import { verticalScale } from "@/utils/styling";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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
  const router = useRouter();
  const styles = React.useMemo(
    () => createStyles(colors, isDarkMode),
    [colors, isDarkMode]
  );
  const isIOS = Platform.OS === "ios";
  const bottomInset = isIOS ? insets.bottom : 0;
  const iosBottomOffset =
    bottomInset > 0
      ? Math.max(0, bottomInset - spacingY._15 + 10)
      : spacingY._5 + 10;
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
  const handleAddTransaction = React.useCallback(() => {
    router.push("/(modals)/transactionModal");
  }, [router]);

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
              intensity={isDarkMode ? 40 : 60}
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

        {(() => {
          const tabItems: React.ReactNode[] = [];

          state.routes.forEach((route, index) => {
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

            if (index === 2) {
              tabItems.push(
                <TouchableOpacity
                  key="add-transaction"
                  accessibilityLabel="Add transaction"
                  accessibilityRole="button"
                  onPress={handleAddTransaction}
                  style={styles.centerButton}
                  activeOpacity={0.85}
                >
                  <View style={styles.centerButtonInner} pointerEvents="none">
                    <Icons.PlusIcon
                      size={verticalScale(28)}
                      weight="bold"
                      color={colors.black}
                    />
                  </View>
                </TouchableOpacity>
              );
            }

            tabItems.push(
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
                <View style={styles.tabItemInner} pointerEvents="none">
                  {isFocused && (
                    <>
                      <LinearGradient
                        pointerEvents="none"
                        colors={
                          isDarkMode ? focusDarkGradient : focusLightGradient
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.focusGradient}
                      />
                      <View pointerEvents="none" style={styles.focusBorder} />
                      <LinearGradient
                        pointerEvents="none"
                        colors={isDarkMode ? focusDarkSheen : focusLightSheen}
                        start={{ x: 0.2, y: 0 }}
                        end={{ x: 0.8, y: 1 }}
                        locations={[0, 0.4, 1]}
                        style={styles.focusHighlight}
                      />
                    </>
                  )}
                  <View style={styles.iconWrapper}>
                    {tabbarIcons[route.name] &&
                      tabbarIcons[route.name](isFocused)}
                  </View>
                </View>
              </TouchableOpacity>
            );
          });

          return tabItems;
        })()}
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

const focusLightGradient = [
  "rgba(255, 255, 255, 0.75)",
  "rgba(255, 255, 255, 0.15)",
  "rgba(255, 255, 255, 0.55)",
] as const;

const focusDarkGradient = [
  "rgba(255, 255, 255, 0.45)",
  "rgba(255, 255, 255, 0.1)",
  "rgba(255, 255, 255, 0.35)",
] as const;

const focusLightSheen = [
  "rgba(255, 255, 255, 0.8)",
  "rgba(255, 255, 255, 0.3)",
  "rgba(148, 163, 184, 0.25)",
] as const;

const focusDarkSheen = [
  "rgba(255, 255, 255, 0.5)",
  "rgba(255, 255, 255, 0.15)",
  "rgba(30, 30, 30, 0.45)",
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
        ? "rgba(12, 12, 12, 0.50)"
        : "rgba(255, 255, 255, 0.38)",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDarkMode
        ? "rgba(255, 255, 255, 0.06)"
        : "rgba(148, 163, 184, 0.25)",
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 16,
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
    tabItemInner: {
      width: verticalScale(46),
      height: verticalScale(46),
      borderRadius: verticalScale(23),
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    iconWrapper: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: verticalScale(23),
    },
    centerButton: {
      width: verticalScale(54),
      height: verticalScale(54),
      borderRadius: verticalScale(29),
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: spacingX._5,
      backgroundColor: colors.cardBackground,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderColor,
      shadowColor: "#000",
      shadowOpacity: isDarkMode ? 0.35 : 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    centerButtonInner: {
      width: verticalScale(46),
      height: verticalScale(46),
      borderRadius: verticalScale(26),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primaryLight,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDarkMode
        ? "rgba(255, 255, 255, 0.12)"
        : "rgba(148, 163, 184, 0.35)",
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
    focusGradient: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: verticalScale(23),
      opacity: 0.95,
    },
    focusBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: verticalScale(23),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDarkMode
        ? "rgba(255, 255, 255, 0.35)"
        : "rgba(148, 163, 184, 0.5)",
      backgroundColor: isDarkMode
        ? "rgba(15, 15, 15, 0.25)"
        : "rgba(255, 255, 255, 0.35)",
    },
    focusHighlight: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: verticalScale(23),
      opacity: isDarkMode ? 0.55 : 0.75,
    },
  });
