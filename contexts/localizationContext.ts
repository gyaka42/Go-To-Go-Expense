import {
  DEFAULT_LANGUAGE,
  LanguageCode,
  translations,
} from "@/constants/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "app_language";

type TranslationParams = Record<string, string | number>;

type LocalizationContextType = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => Promise<void>;
  t: (key: string, params?: TranslationParams) => string;
};

const LocalizationContext = createContext<LocalizationContextType | null>(null);

type LocalizationProviderProps = {
  children: ReactNode;
};

export const LocalizationProvider = ({
  children,
}: LocalizationProviderProps) => {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const hydrateLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedLanguage && storedLanguage in translations) {
          setLanguageState(storedLanguage as LanguageCode);
        }
      } catch (error) {
        console.warn("Failed to load stored language", error);
      }
    };

    hydrateLanguage();
  }, []);

  const setLanguage = useCallback(async (value: LanguageCode) => {
    try {
      setLanguageState(value);
      await AsyncStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      console.warn("Failed to persist language", error);
    }
  }, []);

  const translate = useCallback(
    (key: string, params?: TranslationParams) => {
      const current = translations[language] ?? translations[DEFAULT_LANGUAGE];
      const template =
        current[key] ?? translations[DEFAULT_LANGUAGE][key] ?? key;

      if (!params) return template;

      return Object.entries(params).reduce((acc, [paramKey, value]) => {
        const pattern = new RegExp(`\\{\\{${paramKey}\\}}`, "g");
        return acc.replace(pattern, String(value));
      }, template);
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translate,
    }),
    [language, setLanguage, translate]
  );

  return React.createElement(LocalizationContext.Provider, { value }, children);
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider"
    );
  }
  return context;
};
