import { ThemeColors, radius, spacingX } from "@/constants/theme";
import { useTheme } from "@/contexts/themeContext";
import { WalletType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { Router } from "expo-router";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Typo from "./Typo";

const WalletListItem = ({
  item,
  index,
  router,
}: {
  item: WalletType;
  index: number;
  router: Router;
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const openWallet = () => {
    router.push({
      pathname: "/(modals)/walletModal",
      params: {
        id: item?.id,
        name: item?.name,
        image: item?.image,
      },
    });
  };
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(45)}
    >
      <TouchableOpacity style={styles.container} onPress={openWallet}>
        <View style={styles.imageContainer}>
          <Image
            style={{ flex: 1 }}
            source={item?.image}
            contentFit="cover"
            transition={100}
          />
        </View>
        <View style={styles.nameContainer}>
          <Typo size={16}>{item?.name}</Typo>
          <Typo size={14} color={colors.neutral400}>
            € {item?.amount},-
          </Typo>
        </View>
        <Icons.CaretRightIcon
          size={verticalScale(20)}
          weight="bold"
          color={colors.neutral400}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WalletListItem;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(17),
    },
    imageContainer: {
      height: verticalScale(45),
      width: verticalScale(45),
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: radius._12,
      borderCurve: "continuous",
      overflow: "hidden",
    },
    nameContainer: {
      flex: 1,
      gap: 2,
      marginLeft: spacingX._10,
    },
  });
