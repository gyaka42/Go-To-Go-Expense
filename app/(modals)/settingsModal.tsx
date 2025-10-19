import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

const languages = [
  { code: "NL", label: "Nederlands" },
  { code: "TR", label: "Türkçe" },
  { code: "EN", label: "English" },
  { code: "DE", label: "Deutsch" },
];

const SettingsModal = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("NL");
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Instellingen"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._15 }}
        />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Typo size={18} fontWeight={"600"}>
              Taal
            </Typo>
            <Typo color={colors.neutral400}>Kies je voorkeurstaal</Typo>
            <View style={styles.languageList}>
              {languages.map((language) => {
                const isSelected = selectedLanguage === language.code;
                return (
                  <TouchableOpacity
                    key={language.code}
                    activeOpacity={0.8}
                    onPress={() => setSelectedLanguage(language.code)}
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
                      {language.label}
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
              Thema
            </Typo>
            <View style={styles.themeRow}>
              <View style={{ flex: 1 }}>
                <Typo size={16} fontWeight={"500"}>
                  Donkere modus
                </Typo>
                <Typo color={colors.neutral400}>
                  Schakel over tussen licht en donker
                </Typo>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  content: {
    gap: spacingY._25,
    paddingBottom: spacingY._20,
  },
  section: {
    backgroundColor: colors.neutral900,
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
    backgroundColor: colors.neutral800,
    borderRadius: radius._12,
    borderCurve: "continuous",
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
