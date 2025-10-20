import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import WalletListItem from "@/components/WalletListItem";
import { ThemeColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { useLocalization } from "@/contexts/localizationContext";
import { useTheme } from "@/contexts/themeContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

const Wallet = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLocalization();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const constraints = useMemo(() => {
    if (!user?.uid) return [];
    return [where("uid", "==", user.uid), orderBy("created", "desc")];
  }, [user?.uid]);

  const {
    data: wallets,
    loading,
    error,
  } = useFetchData<WalletType>("wallets", constraints, [user?.uid]);

  console.log("wallets:", wallets.length, { loading, error });

  const getTotalBalance = () =>
    wallets.reduce((total, item) => {
      total = total + (item.amount || 0);
      return total;
    }, 0);

  return (
    <ScreenWrapper
      style={{ backgroundColor: colors.cardBackground }}
      statusBarBackgroundColor={colors.cardBackground}
    >
      <View style={styles.container}>
        {/* Balance view */}
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={45} fontWeight={"500"}>
              € {getTotalBalance()?.toFixed(2)},-
            </Typo>
            <Typo size={16} color={colors.text}>
              {t("wallet.totalAmount")}
            </Typo>
          </View>
        </View>

        {/* All Wallets */}
        <View style={styles.wallets}>
          {/* header wallet */}
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={"500"}>
              {t("wallet.myWallets")}
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/walletModal")}
            >
              <Icons.PlusSquareIcon
                weight="fill"
                color={colors.primaryLight}
                size={verticalScale(33)}
              />
            </TouchableOpacity>
          </View>

          {/* nog te doen: Wallet list */}
          {error ? (
            <Typo color="red">
              {t("wallet.errorPrefix")}: {error}
            </Typo>
          ) : loading ? (
            <Loading />
          ) : (
            <FlatList
              data={wallets}
              keyExtractor={(item) => (item as any).id}
              renderItem={({ item, index }) => (
                <WalletListItem item={item} index={index} router={router} />
              )}
              contentContainerStyle={styles.listStyle}
              ListEmptyComponent={
                <Typo color={colors.neutral300}>{t("wallet.emptyList")}</Typo>
              }
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Wallet;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
    },
    balanceView: {
      height: verticalScale(160),
      backgroundColor: colors.cardBackground,
      alignItems: "center",
      justifyContent: "center",
      borderBottomLeftRadius: radius._30,
      borderBottomRightRadius: radius._30,
      marginTop: spacingY._15,
    },
    flexRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacingY._10,
    },
    wallets: {
      flex: 1,
      backgroundColor: colors.appBackground,
      borderTopRightRadius: radius._30,
      borderTopLeftRadius: radius._30,
      padding: spacingX._20,
      paddingTop: spacingX._25,
    },
    listStyle: {
      paddingVertical: spacingY._25,
      paddingTop: spacingY._15,
    },
  });
