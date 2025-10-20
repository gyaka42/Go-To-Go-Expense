import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransactionList from "@/components/TransactionList";
import { ThemeColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { useLocalization } from "@/contexts/localizationContext";
import { useTheme } from "@/contexts/themeContext";
import {
  fetchMonthlyStats,
  fetchWeeklyStats,
  fetchYearlyStats,
} from "@/services/transactionService";
import { scale, verticalScale } from "@/utils/styling";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const Statistics = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const { t } = useLocalization();
  const { colors, isDarkMode } = useTheme();
  const styles = React.useMemo(
    () => createStyles(colors, isDarkMode),
    [colors, isDarkMode]
  );

  useEffect(() => {
    if (activeIndex === 0) {
      getWeeklyStats();
    }
    if (activeIndex === 1) {
      getMonthlyStats();
    }
    if (activeIndex === 2) {
      getYearlyStats();
    }
  }, [activeIndex]);

  const getWeeklyStats = async () => {
    setChartLoading(true);
    let res = await fetchWeeklyStats(user?.uid as string);
    setChartLoading(false);

    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert(t("common.error"), res.msg);
    }
  };

  const getMonthlyStats = async () => {
    setChartLoading(true);
    let res = await fetchMonthlyStats(user?.uid as string);
    setChartLoading(false);

    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert(t("common.error"), res.msg);
    }
  };

  const getYearlyStats = async () => {
    setChartLoading(true);
    let res = await fetchYearlyStats(user?.uid as string);
    setChartLoading(false);

    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert(t("common.error"), res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title={t("statistics.title")} />
        </View>
        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          <SegmentedControl
            values={[
              t("statistics.segments.weekly"),
              t("statistics.segments.monthly"),
              t("statistics.segments.yearly"),
            ]}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor={colors.primaryLight}
            backgroundColor={colors.cardBackground}
            appearance={isDarkMode ? "dark" : "light"}
            activeFontStyle={styles.segmentFontStyle}
            style={styles.segmentStyle}
            fontStyle={{ ...styles.segmentFontStyle, color: colors.neutral400 }}
          />
          <View style={styles.chartContainer}>
            {chartData.length > 0 ? (
              <BarChart
                data={chartData}
                barWidth={scale(12)}
                spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
                roundedTop
                roundedBottom
                hideRules
                yAxisLabelPrefix="€"
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelWidth={
                  [1, 2].includes(activeIndex) ? scale(38) : scale(35)
                }
                yAxisTextStyle={{ color: colors.neutral400 }}
                xAxisLabelTextStyle={{
                  color: colors.neutral400,
                  fontSize: verticalScale(12),
                }}
                noOfSections={3}
                minHeight={5}
                isAnimated={true}
                animationDuration={1000}
                //maxValue={100}
              />
            ) : (
              <View style={styles.noChart} />
            )}

            {chartLoading && (
              <View style={styles.chartLoadingContainer}>
                <Loading color={colors.text} />
              </View>
            )}
          </View>

          {/*Transactions*/}

          <View>
            <TransactionList
              title={t("statistics.transactionsTitle")}
              emptyListMessage={t("statistics.transactionsEmpty")}
              data={transactions}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const createStyles = (colors: ThemeColors, isDarkMode: boolean) =>
  StyleSheet.create({
    chartContainer: {
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
    },
    chartLoadingContainer: {
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: radius._12,
      backgroundColor: isDarkMode ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.15)",
      justifyContent: "center",
      alignItems: "center",
    },
    header: {},
    noChart: {
      backgroundColor: colors.cardBackground,
      height: verticalScale(210),
      width: "100%",
      borderRadius: radius._12,
      borderCurve: "continuous",
    },
    segmentStyle: {
      height: scale(37),
      borderRadius: radius._12,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    segmentFontStyle: {
      fontSize: verticalScale(13),
      fontWeight: "bold",
      color: colors.text,
    },
    container: {
      paddingHorizontal: spacingX._20,
      paddingVertical: spacingY._5,
      gap: spacingY._10,
    },
  });
