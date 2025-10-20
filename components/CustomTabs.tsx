import { ThemeColors, spacingY } from "@/constants/theme";
import { useTheme } from "@/contexts/themeContext";
import { verticalScale } from "@/utils/styling";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Icons from "phosphor-react-native";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

export default function CustomTabs({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
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
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

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
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    tabbar: {
      flexDirection: "row",
      width: "100%",
      height: Platform.OS === "ios" ? verticalScale(73) : verticalScale(55),
      backgroundColor: colors.cardBackground,
      alignItems: "center",
      justifyContent: "space-around",
      borderTopColor: colors.borderColor,
      borderTopWidth: 1,
    },
    tabbarItem: {
      marginBottom: Platform.OS === "ios" ? spacingY._10 : spacingY._5,
      justifyContent: "center",
      alignItems: "center",
    },
  });
