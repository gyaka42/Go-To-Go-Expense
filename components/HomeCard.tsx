import { ThemeColors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { useLocalization } from "@/contexts/localizationContext";
import { useTheme } from "@/contexts/themeContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useMemo } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import Typo from "./Typo";

const HomeCard = () => {
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

  const getTotals = () => {
    if (!wallets || wallets.length === 0) {
      return { balance: 0, income: 0, expenses: 0 } as const;
    }
    return wallets.reduce(
      (totals: any, item: WalletType) => {
        totals.balance = totals.balance + Number(item.amount);
        totals.income = totals.income + Number(item.totalIncome);
        totals.expenses = totals.expenses + Number(item.totalExpenses);
        return totals;
      },
      { balance: 0, income: 0, expenses: 0 }
    );
  };

  return (
    <ImageBackground
      source={require("../assets/images/card.png")}
      resizeMode="stretch"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View>
          {/* Totaal Balans */}
          <View style={styles.totalBalanceRow}>
            <Typo color={colors.neutral800} size={17} fontWeight={"500"}>
              {t("homeCard.totalBalance")}
            </Typo>
            <Icons.DotsThreeOutlineIcon
              size={verticalScale(23)}
              color={colors.black}
              weight="fill"
            />
          </View>
          <Typo color={colors.black} size={30} fontWeight={"bold"}>
            € {loading ? "----" : getTotals().balance.toFixed(2)},-
          </Typo>
        </View>

        {/* total Expenses and income */}
        <View style={styles.stats}>
          {/* income */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowDownIcon
                  size={verticalScale(15)}
                  color={colors.white}
                  weight="bold"
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                {t("homeCard.income")}
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo fontWeight={"600"} color={colors.green} size={17}>
                € {loading ? "----" : getTotals().income.toFixed(2)},-
              </Typo>
            </View>
          </View>
          {/* expense */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowUpIcon
                  size={verticalScale(15)}
                  color={colors.white}
                  weight="bold"
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                {t("homeCard.expenses")}
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo fontWeight={"600"} color={colors.rose} size={17}>
                € {loading ? "----" : getTotals().expenses.toFixed(2)},-
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    bgImage: {
      height: scale(210),
      width: "100%",
    },
    container: {
      padding: spacingX._20,
      paddingHorizontal: scale(23),
      height: "87%",
      width: "100%",
      justifyContent: "space-between",
    },
    totalBalanceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacingY._5,
    },
    stats: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statsIcon: {
      backgroundColor: colors.neutral350,
      padding: spacingY._5,
      borderRadius: 50,
    },
    incomeExpense: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacingY._7,
    },
  });
