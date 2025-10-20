import { getThemeColors, ThemeColors, ThemeMode } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SystemUI from "expo-system-ui";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const THEME_STORAGE_KEY = "app-theme";

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  isDarkMode: boolean;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadStoredTheme = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedValue === "light" || storedValue === "dark") {
          setMode(storedValue);
        }
      } catch (error) {
        console.warn("Failed to load stored theme", error);
      } finally {
        setIsHydrated(true);
      }
    };

    loadStoredTheme();
  }, []);

  const colors = useMemo(() => getThemeColors(mode), [mode]);

  useEffect(() => {
    if (!isHydrated) return;

    AsyncStorage.setItem(THEME_STORAGE_KEY, mode).catch((error) =>
      console.warn("Failed to persist theme", error)
    );

    SystemUI.setBackgroundColorAsync(colors.appBackground).catch((error) =>
      console.warn("Failed to set system UI background", error)
    );
  }, [mode, colors, isHydrated]);

  const handleSetTheme = useCallback((value: ThemeMode) => {
    setMode(value);
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prev: any) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors,
      isDarkMode: mode === "dark",
      setTheme: handleSetTheme,
      toggleTheme,
    }),
    [mode, colors, handleSetTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
