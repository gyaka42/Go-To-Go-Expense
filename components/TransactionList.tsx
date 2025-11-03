import { expenseCategories, incomeCategory } from "@/constants/data";
import { ThemeColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useLocalization } from "@/contexts/localizationContext";
import { useTheme } from "@/contexts/themeContext";
import {
  TransactionItemProps,
  TransactionListType,
  TransactionType,
} from "@/types";
import { verticalScale } from "@/utils/styling";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Loading from "./Loading";
import Typo from "./Typo";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
  showTopFade = true,
}: TransactionListType) => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const handleClick = (item: TransactionType) => {
    // open transactie details
    router.push({
      pathname: "/(modals)/transactionModal",
      params: {
        id: item?.id,
        type: item?.type,
        amount: item?.amount.toString(),
        category: item?.category,
        date: (item.date as Timestamp)?.toDate()?.toISOString(),
        description: item?.description,
        image: item?.image,
        uid: item?.uid,
        walletId: item?.walletId,
      },
    });
  };
  return (
    <View style={styles.container}>
      {title && (
        <Typo size={20} fontWeight={"500"}>
          {title}
        </Typo>
      )}

      <View style={styles.list}>
        <FlashList<TransactionType>
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
        {showTopFade && (
          <LinearGradient
            pointerEvents="none"
            colors={[
              hexToRgba(colors.appBackground, 1),
              hexToRgba(colors.appBackground, 0),
            ]}
            locations={[0, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.topFade}
          />
        )}
      </View>

      {!loading && data.length === 0 && (
        <Typo
          size={15}
          color={colors.neutral400}
          style={{ textAlign: "center", marginTop: spacingY._15 }}
        >
          {emptyListMessage}
        </Typo>
      )}

      {loading && (
        <View style={{ top: verticalScale(100) }}>
          <Loading />
        </View>
      )}
    </View>
  );
};

const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  let category =
    item?.type === "income"
      ? incomeCategory
      : expenseCategories[item.category!];
  const IconComponent = category.icon;
  const { t } = useLocalization();
  const categoryLabel = category.labelKey
    ? t(category.labelKey)
    : category.label;
  // Determine device locale with NL fallback and robust date conversion
  const rawDate = (item as any)?.date;
  const d =
    rawDate instanceof Timestamp
      ? rawDate.toDate()
      : rawDate instanceof Date
      ? rawDate
      : rawDate
      ? new Date(rawDate)
      : null;

  const locale = Intl.DateTimeFormat().resolvedOptions().locale || "nl-NL";
  const date = d
    ? d.toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70)
        .springify()
        .damping(45)}
    >
      <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
        <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
          {IconComponent && (
            <IconComponent
              size={verticalScale(25)}
              weight="fill"
              color={colors.white}
            />
          )}
        </View>

        <View style={styles.categoryDes}>
          <Typo size={17}>{categoryLabel}</Typo>
          <Typo
            size={12}
            color={colors.neutral400}
            textProps={{ numberOfLines: 1 }}
          >
            {/*{item?.description}*/}
            {item?.description}
          </Typo>
        </View>

        <View style={styles.amountDate}>
          <Typo
            fontWeight={"500"}
            color={item?.type === "income" ? colors.primary : colors.rose}
          >
            {`${item?.type === "income" ? "+ €" : "- €"} ${item?.amount}`}
          </Typo>
          <Typo size={11} color={colors.neutral400}>
            {date}
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransactionList;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: spacingY._17,
    },
    list: {
      flex: 1,
      position: "relative",
    },
    listContent: {
      paddingBottom: spacingY._20,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: spacingX._12,
      marginBottom: spacingY._12,

      backgroundColor: colors.cardBackground,
      padding: spacingY._10,
      paddingHorizontal: spacingY._10,
      borderRadius: radius._17,
    },
    icon: {
      height: verticalScale(44),
      aspectRatio: 1,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: radius._12,
      borderCurve: "continuous",
    },
    categoryDes: {
      flex: 1,
      gap: 2.5,
    },
    amountDate: {
      alignItems: "flex-end",
      gap: 3,
    },
    topFade: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: verticalScale(20),
    },
  });

function hexToRgba(hexColor: string, alpha: number) {
  let hex = hexColor.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
