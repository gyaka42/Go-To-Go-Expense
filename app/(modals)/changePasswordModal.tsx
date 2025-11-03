import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { ThemeColors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { useLocalization } from "@/contexts/localizationContext";
import { useTheme } from "@/contexts/themeContext";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

const ChangePasswordModal = () => {
  const router = useRouter();
  const { changePassword } = useAuth();
  const { t } = useLocalization();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t("common.error"), t("auth.common.fillFields"));
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(t("common.error"), t("changePasswordModal.error.length"));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t("common.error"), t("changePasswordModal.error.mismatch"));
      return;
    }

    setIsSubmitting(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsSubmitting(false);

    if (!res.success) {
      Alert.alert(t("common.error"), res.msg);
      return;
    }

    Alert.alert(
      t("changePasswordModal.successTitle"),
      t("changePasswordModal.successMessage"),
      [
        {
          text: t("common.ok"),
          onPress: () => router.back(),
        },
      ]
    );
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={t("changePasswordModal.title")}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.text}>
              {t("changePasswordModal.currentLabel")}
            </Typo>
            <Input
              placeholder={t("changePasswordModal.currentPlaceholder")}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              icon={
                <Icons.LockKeyIcon
                  size={verticalScale(26)}
                  color={colors.neutral400}
                />
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.text}>{t("changePasswordModal.newLabel")}</Typo>
            <Input
              placeholder={t("changePasswordModal.newPlaceholder")}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              icon={
                <Icons.LockLaminatedIcon
                  size={verticalScale(26)}
                  color={colors.neutral400}
                />
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.text}>
              {t("changePasswordModal.confirmLabel")}
            </Typo>
            <Input
              placeholder={t("changePasswordModal.confirmPlaceholder")}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon={
                <Icons.LockLaminatedIcon
                  size={verticalScale(26)}
                  color={colors.neutral400}
                />
              }
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button
          loading={isSubmitting}
          onPress={handleSubmit}
          style={{ flex: 1 }}
        >
          <Typo size={18} color={colors.black} fontWeight={"600"}>
            {t("changePasswordModal.submit")}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default ChangePasswordModal;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: spacingY._30,
    },
    form: {
      gap: spacingY._30,
      marginTop: spacingY._15,
    },
    inputContainer: {
      gap: spacingY._10,
    },
    footer: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: spacingX._20,
      gap: spacingX._15,
      paddingTop: spacingY._15,
      borderTopColor: colors.borderColor,
      marginBottom: spacingY._5,
      borderWidth: 1,
      borderColor: colors.borderColor,
      backgroundColor: colors.cardBackground,
    },
  });
