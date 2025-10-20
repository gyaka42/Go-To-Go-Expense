import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { ThemeColors, radius, spacingX, spacingY } from "@/constants/theme";
import { LanguageCode } from "@/constants/translations";
import { useLocalization } from "@/contexts/localizationContext";
import { useTheme } from "@/contexts/themeContext";
import { scale, verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

const languages: { code: LanguageCode; label: string }[] = [
  { code: "NL", label: "Nederlands" },
  { code: "TR", label: "Türkçe" },
  { code: "EN", label: "English" },
  { code: "DE", label: "Deutsch" },
];

const SettingsModal = () => {
  const { language, setLanguage, t } = useLocalization();

  const { colors, isDarkMode, setTheme } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={t("settings.title")}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._15 }}
        />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Typo size={18} fontWeight={"600"}>
              {t("settings.languageTitle")}
            </Typo>
            <Typo color={colors.neutral400}>
              {t("settings.languageSubtitle")}
            </Typo>
            <View style={styles.languageList}>
              {languages.map((option) => {
                const isSelected = language === option.code;
                return (
                  <TouchableOpacity
                    key={option.code}
                    activeOpacity={0.8}
                    onPress={() => setLanguage(option.code)}
                    style={[
                      styles.languageOption,
                      isSelected && styles.languageOptionActive,
                    ]}
                  >
                    <Typo
                      size={16}
                      fontWeight={"500"}
                      color={isSelected ? colors.black : colors.white}
                    >
                      {option.label}
                    </Typo>
                    {isSelected && (
                      <Icons.CheckCircleIcon
                        size={verticalScale(22)}
                        color={colors.black}
                        weight="fill"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Typo size={18} fontWeight={"600"}>
              {t("settings.themeTitle")}
            </Typo>
            <View style={styles.themeRow}>
              <View style={{ flex: 1 }}>
                <Typo size={16} fontWeight={"500"}>
                  {t("settings.darkMode")}
                </Typo>
                <Typo color={colors.neutral400}>
                  {t("settings.darkModeDescription")}
                </Typo>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={(value) => setTheme(value ? "dark" : "light")}
                trackColor={{ false: colors.neutral600, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default SettingsModal;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacingX._20,
    },
    content: {
      gap: spacingY._25,
      paddingBottom: spacingY._20,
    },
    section: {
      backgroundColor: colors.cardBackground,
      padding: spacingX._20,
      borderRadius: radius._15,
      borderCurve: "continuous",
      gap: spacingY._10,
    },
    languageList: {
      gap: spacingY._10,
    },
    languageOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacingY._12,
      paddingHorizontal: spacingX._15,
      backgroundColor: colors.appBackground,
      borderRadius: radius._12,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    languageOptionActive: {
      backgroundColor: colors.primaryLight,
    },
    themeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: scale(12),
    },
  });
