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
import {
  Alert,
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Login = () => {
  const emailValueRef = useRef("");
  const passwordValueRef = useRef("");
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login: loginUser } = useAuth();
  const { t } = useLocalization();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const inputAccessoryViewID = "loginInputsAccessory";

  const focusField = (field: "email" | "password") => {
    if (field === "email") {
      emailInputRef.current?.focus();
    } else {
      passwordInputRef.current?.focus();
    }
  };

  const handlePrevious = () => {
    if (focusedField === "password") {
      focusField("email");
    }
  };

  const handleNext = () => {
    if (focusedField === "email") {
      focusField("password");
    }
  };

  const handleDone = () => {
    Keyboard.dismiss();
    if (focusedField === "password") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!emailValueRef.current || !passwordValueRef.current) {
      Alert.alert(t("auth.login.title"), t("auth.common.fillFields"));
      return;
    }
    setIsLoading(true);
    const res = await loginUser(
      emailValueRef.current,
      passwordValueRef.current
    );
    setIsLoading(false);
    if (!res.success) {
      Alert.alert(t("auth.login.title"), res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Back Button Here */}
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            {t("auth.login.greeting")}
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Welkom terug
          </Typo>
        </View>
        {/* hier komt Form */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Log in en volg direct al je uitgaven
          </Typo>
          {/* Hier komt Input */}
          <Input
            placeholder={t("auth.common.emailPlaceholder")}
            autoCapitalize="none"
            keyboardType="email-address"
            inputRef={emailInputRef}
            onFocus={() => setFocusedField("email")}
            onChangeText={(value) => (emailValueRef.current = value)}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => focusField("password")}
            inputAccessoryViewID={
              Platform.OS === "ios" ? inputAccessoryViewID : undefined
            }
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
            inputRef={passwordInputRef}
            onFocus={() => setFocusedField("password")}
            onChangeText={(value) => (passwordValueRef.current = value)}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            inputAccessoryViewID={
              Platform.OS === "ios" ? inputAccessoryViewID : undefined
            }
            icon={
              <Icons.LockIcon
                size={verticalScale(26)}
                color={colors.neutral400}
              />
            }
          />
          <Pressable
            style={{ alignSelf: "flex-end" }}
            onPress={() => router.navigate("/(auth)/forgot-password")}
          >
            <Typo size={14} style={styles.forgotPassword}>
              {t("auth.login.forgotPassword")}
            </Typo>
          </Pressable>

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              {t("auth.login.submit")}
            </Typo>
          </Button>
        </View>
        {Platform.OS === "ios" && (
          <InputAccessoryView nativeID={inputAccessoryViewID}>
            <View
              style={[
                styles.inputAccessory,
                { borderColor: colors.borderColor },
              ]}
            >
              <View style={styles.accessoryControls}>
                <TouchableOpacity
                  onPress={handlePrevious}
                  disabled={focusedField !== "password"}
                  style={styles.accessoryButton}
                >
                  <Icons.ArrowUpIcon
                    size={18}
                    color={
                      focusedField === "password"
                        ? colors.text
                        : colors.neutral400
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNext}
                  disabled={focusedField !== "email"}
                  style={styles.accessoryButton}
                >
                  <Icons.ArrowDownIcon
                    size={18}
                    color={
                      focusedField === "email" ? colors.text : colors.neutral400
                    }
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={handleDone}
                style={styles.accessorySubmitButton}
              >
                <Icons.CheckIcon size={20} color={colors.primaryLight} />
              </TouchableOpacity>
            </View>
          </InputAccessoryView>
        )}

        {/* Footer komt hier */}

        <View style={styles.footer}>
          <Typo size={15}>{t("auth.login.noAccountQuestion")}</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/register")}>
            <Typo size={15} fontWeight={"700"} color={colors.primaryLight}>
              {t("auth.login.goToRegister")}
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

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
    forgotPassword: {
      textAlign: "right",
      fontWeight: "500",
      color: colors.primaryLight,
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
    inputAccessory: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacingX._15,
      paddingVertical: spacingY._10,
      backgroundColor: colors.neutral100,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    accessoryControls: {
      flexDirection: "row",
      gap: spacingX._10,
    },
    accessoryButton: {
      padding: spacingX._10,
    },
    accessorySubmitButton: {
      padding: spacingX._10,
    },
  });
