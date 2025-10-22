import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { ThemeColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useLocalization } from "@/contexts/localizationContext";
import { useTheme } from "@/contexts/themeContext";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const Welcome = () => {
  const { t } = useLocalization();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* login button en image */}
        <View>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={styles.loginButton}
          >
            <Typo fontWeight={"500"}>{t("welcome.login")}</Typo>
          </TouchableOpacity>
          <Animated.Image
            entering={FadeIn.duration(800)}
            source={require("../../assets/images/welcome.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
          <View style={styles.titleContainer}>
            <Typo
              size={40}
              fontWeight={"600"}
              style={{ ...styles.titleText, ...styles.titlePrimary }}
            >
              Go-To-Go
            </Typo>
            <Typo
              size={30}
              fontWeight={"600"}
              style={{ ...styles.titleText, ...styles.titleSecondary }}
            >
              Expense
            </Typo>
          </View>
        </View>
        {/* Footer */}

        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(100)
              .springify()
              .damping(40)}
            style={{ alignItems: "center" }}
          >
            <Typo size={30} fontWeight={"800"}>
              {t("welcome.headingLine1")}
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              {t("welcome.headingLine2")}
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(40)}
            style={{ alignItems: "center", gap: 2 }}
          >
            <Typo size={17} color={colors.textLight}>
              {t("welcome.taglineLine1")}
            </Typo>
            <Typo size={17} color={colors.textLight}>
              {t("welcome.taglineLine2")}
            </Typo>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(200)
              .springify()
              .damping(40)}
            style={styles.buttonContainer}
          >
            {/* Button */}
            <Button onPress={() => router.push("/(auth)/register")}>
              <Typo size={22} color={colors.black} fontWeight={"600"}>
                {t("welcome.primaryCta")}
              </Typo>
            </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingTop: spacingY._7,
    },
    welcomeImage: {
      width: "100%",
      height: verticalScale(300),
      alignSelf: "center",
      position: "absolute",
      marginTop: verticalScale(100),
    },
    titleContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: verticalScale(24),
      gap: verticalScale(4),
      paddingTop: 320,
      position: "relative",
    },
    titleText: {
      letterSpacing: 0.5,
      textAlign: "center",
      justifyContent: "center",
    },
    titlePrimary: {
      lineHeight: Math.round(verticalScale(50) * 1.1),
    },
    titleSecondary: {
      lineHeight: Math.round(verticalScale(40) * 1.1),
    },
    loginButton: {
      alignSelf: "flex-end",
      marginRight: spacingX._20,
    },
    footer: {
      backgroundColor: colors.cardBackground,
      alignItems: "center",
      paddingTop: verticalScale(30),
      paddingBottom: verticalScale(45),
      gap: spacingY._20,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: -10 },
      elevation: 10,
      shadowRadius: 25,
      shadowOpacity: 0.15,
      borderTopLeftRadius: radius._30,
      borderTopRightRadius: radius._30,
    },
    buttonContainer: {
      width: "100%",
      paddingHorizontal: spacingX._25,
    },
  });
