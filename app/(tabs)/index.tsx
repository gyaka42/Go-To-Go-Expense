import HomeCard from "@/components/HomeCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransactionList from "@/components/TransactionList";
import Typo from "@/components/Typo";
import { ThemeColors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { useLocalization } from "@/contexts/localizationContext";
import { useTheme } from "@/contexts/themeContext";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLocalization();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const constraints = React.useMemo(() => {
    if (!user?.uid) return undefined;
    return [where("uid", "==", user.uid), orderBy("date", "desc"), limit(30)];
  }, [user?.uid]);

  const { data: recentTransactions, loading: loadingTransactions } =
    useFetchData<TransactionType>("transactions", constraints, [user?.uid], {
      enabled: Boolean(user?.uid),
    });

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.text}>
              {t("home.greeting")}
            </Typo>
            <Typo size={20} fontWeight={"500"}>
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(modals)/searchModal")}
            style={styles.searchIcon}
          >
            <Icons.MagnifyingGlassIcon
              size={verticalScale(22)}
              color={colors.neutral400}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* CARD */}
          <View style={styles.cardWrapper}>
            <HomeCard />
          </View>

          {/* Transacties */}
          <View style={styles.transactionsWrapper}>
            <TransactionList
              data={recentTransactions}
              loading={loadingTransactions}
              title={t("home.recentTransactionsTitle")}
              emptyListMessage={t("home.noTransactions")}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacingX._20,
      marginTop: verticalScale(8),
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacingY._10,
    },
    searchIcon: {
      backgroundColor: colors.cardBackground,
      padding: spacingX._10,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },

    cardWrapper: {
      marginBottom: spacingY._25,
    },
    transactionsWrapper: {
      flex: 1,
    },
  });
