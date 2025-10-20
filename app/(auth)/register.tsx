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

const Register = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { t } = useLocalization();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert(t("auth.register.title"), t("auth.common.fillFields"));
      return;
    }
    setIsLoading(true);
    const res = await registerUser(
      emailRef.current,
      passwordRef.current,
      nameRef.current
    );
    setIsLoading(false);
    console.log("register result", res);
    if (!res.success) {
      Alert.alert(t("auth.register.title"), res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Back Button Here */}
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            {t("auth.register.headingLine1")}
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            {t("auth.register.headingLine2")}
          </Typo>
        </View>
        {/* hier komt Form */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            {t("auth.register.subtitle")}
          </Typo>
          {/* Hier komt Input */}
          <Input
            placeholder={t("auth.register.namePlaceholder")}
            onChangeText={(value) => (nameRef.current = value)}
            icon={
              <Icons.UserIcon
                size={verticalScale(26)}
                color={colors.neutral400}
                weight="fill"
              />
            }
          />
          <Input
            placeholder={t("auth.common.emailPlaceholder")}
            onChangeText={(value) => (emailRef.current = value)}
            icon={
              <Icons.AtIcon
                size={verticalScale(26)}
                color={colors.neutral400}
              />
            }
          />
          <Input
            placeholder={t("auth.common.passwordPlaceholder")}
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
            icon={
              <Icons.LockIcon
                size={verticalScale(26)}
                color={colors.neutral400}
                weight="fill"
              />
            }
          />

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              {t("auth.register.submit")}
            </Typo>
          </Button>
        </View>

        {/* Footer komt hier */}

        <View style={styles.footer}>
          <Typo size={15}>{t("auth.register.haveAccountQuestion")}</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/login")}>
            <Typo size={15} fontWeight={"700"} color={colors.primaryLight}>
              {t("auth.register.goToLogin")}
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;

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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
    },
    footerText: {
      color: colors.text,
      textAlign: "center",
      fontSize: verticalScale(15),
    },
  });
