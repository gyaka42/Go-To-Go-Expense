import { ThemeColors, radius, spacingX } from "@/constants/theme";
import { useLocalization } from "@/contexts/localizationContext";
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
  const { t } = useLocalization();
  const openWallet = () => {
    if (!item?.id) return;
    router.push({
      pathname: "/wallet/[id]",
      params: { id: item.id },
    });
  };

  const openEdit = () => {
    router.push({
      pathname: "/(modals)/walletModal",
      params: {
        id: item?.id,
        name: item?.name,
        image: item?.image,
        isPrivate: item?.isPrivate ? "1" : "0",
        currency: item?.currency,
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
          {item?.isPrivate ? (
            <View style={styles.badge}>
              <Typo size={11} color={colors.black}>
                {t("wallet.privateBadge")}
              </Typo>
            </View>
          ) : null}
        </View>
        <View style={styles.actionIcons}>
          <TouchableOpacity onPress={openEdit} style={styles.editButton}>
            <Icons.PencilSimpleIcon
              size={verticalScale(18)}
              color={colors.neutral400}
            />
          </TouchableOpacity>
          <Icons.CaretRightIcon
            size={verticalScale(20)}
            weight="bold"
            color={colors.neutral400}
          />
        </View>
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
    badge: {
      alignSelf: "flex-start",
      paddingHorizontal: spacingX._5,
      paddingVertical: 2,
      backgroundColor: colors.primaryLight,
      borderRadius: radius._6,
      borderCurve: "continuous",
      marginTop: 4,
    },
    actionIcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacingX._5,
    },
    editButton: {
      padding: 4,
    },
  });
