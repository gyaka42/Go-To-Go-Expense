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

const Register = () => {
  const emailValueRef = useRef("");
  const passwordValueRef = useRef("");
  const nameValueRef = useRef("");
  const nameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const [focusedField, setFocusedField] = useState<
    "name" | "email" | "password" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { t } = useLocalization();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const inputAccessoryViewID = "registerInputsAccessory";

  const focusField = (field: "name" | "email" | "password") => {
    if (field === "name") {
      nameInputRef.current?.focus();
      return;
    }
    if (field === "email") {
      emailInputRef.current?.focus();
      return;
    }
    passwordInputRef.current?.focus();
  };

  const handlePrevious = () => {
    if (focusedField === "password") {
      focusField("email");
      return;
    }
    if (focusedField === "email") {
      focusField("name");
    }
  };

  const handleNext = () => {
    if (focusedField === "name") {
      focusField("email");
      return;
    }
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
    if (
      !emailValueRef.current ||
      !passwordValueRef.current ||
      !nameValueRef.current
    ) {
      Alert.alert(t("auth.register.title"), t("auth.common.fillFields"));
      return;
    }
    setIsLoading(true);
    const res = await registerUser(
      emailValueRef.current,
      passwordValueRef.current,
      nameValueRef.current
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
            inputRef={nameInputRef}
            onFocus={() => setFocusedField("name")}
            onChangeText={(value) => (nameValueRef.current = value)}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => focusField("email")}
            inputAccessoryViewID={
              Platform.OS === "ios" ? inputAccessoryViewID : undefined
            }
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
                  disabled={focusedField === "name"}
                  style={styles.accessoryButton}
                >
                  <Icons.ArrowUpIcon
                    size={18}
                    color={
                      focusedField === "name" ? colors.neutral400 : colors.text
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNext}
                  disabled={focusedField === "password"}
                  style={styles.accessoryButton}
                >
                  <Icons.ArrowDownIcon
                    size={18}
                    color={
                      focusedField === "password"
                        ? colors.neutral400
                        : colors.text
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
