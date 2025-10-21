import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { ThemeColors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { useLocalization } from "@/contexts/localizationContext";
import { useTheme } from "@/contexts/themeContext";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

const ForgotPassword = () => {
  const emailRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { resetPassword } = useAuth();
  const { t } = useLocalization();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const handleSubmit = async () => {
    if (!emailRef.current) {
      Alert.alert(t("auth.forgotPassword.title"), t("auth.common.fillFields"));
      return;
    }

    setIsLoading(true);
    const res = await resetPassword(emailRef.current);
    setIsLoading(false);

    if (res.success) {
      Alert.alert(
        t("auth.forgotPassword.title"),
        t("auth.forgotPassword.successMessage"),
        [
          {
            text: t("common.ok"),
            onPress: () => router.replace("/(auth)/login"),
          },
        ]
      );
      return;
    }

    Alert.alert(t("auth.forgotPassword.title"), res.msg);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            {t("auth.forgotPassword.headingLine1")}
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            {t("auth.forgotPassword.headingLine2")}
          </Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            {t("auth.forgotPassword.subtitle")}
          </Typo>
          <Input
            placeholder={t("auth.common.emailPlaceholder")}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(value) => (emailRef.current = value)}
            icon={
              <Icons.AtIcon
                size={verticalScale(26)}
                color={colors.neutral400}
              />
            }
          />

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              {t("auth.forgotPassword.submit")}
            </Typo>
          </Button>
        </View>

        <View style={styles.footer}>
          <Typo size={15}>{t("auth.forgotPassword.rememberPassword")}</Typo>
          <Pressable onPress={() => router.replace("/(auth)/login")}>
            <Typo size={15} fontWeight={"700"} color={colors.primaryLight}>
              {t("auth.forgotPassword.backToLogin")}
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPassword;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: spacingY._30,
      paddingHorizontal: spacingX._20,
    },
    form: {
      gap: spacingY._20,
    },
    footer: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
    },
  });
