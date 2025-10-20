import { scale, verticalScale } from "@/utils/styling";

export type ThemeMode = "light" | "dark";

const sharedColors = {
  primary: "#a3e635",
  primaryLight: "#0ea5e9",
  primaryDark: "#0369a1",
  rose: "#ef4444",
  green: "#16a34a",
  white: "#ffffff",
  black: "#000000",
};

export const darkColors = {
  ...sharedColors,
  text: "#ffffff",
  textLight: "#e5e5e5",
  textLighter: "#d4d4d4",
  neutral50: "#111111",
  neutral100: "#181818",
  neutral200: "#1f1f1f",
  neutral300: "#262626",
  neutral350: "#303030",
  neutral400: "#a3a3a3",
  neutral500: "#737373",
  neutral600: "#525252",
  neutral700: "#404040",
  neutral800: "#262626",
  neutral900: "#171717",
  appBackground: "#0f0f0f",
  cardBackground: "#1f1f1f",
  borderColor: "#27272a",
};

export const lightColors = {
  ...sharedColors,
  text: "#0f172a",
  textLight: "#334155",
  textLighter: "#475569",
  neutral50: "#f8fafc",
  neutral100: "#f1f5f9",
  neutral200: "#e2e8f0",
  neutral300: "#cbd5f5",
  neutral350: "#cbd5f5",
  neutral400: "#94a3b8",
  neutral500: "#64748b",
  neutral600: "#475569",
  neutral700: "#334155",
  neutral800: "#ffffff",
  neutral900: "#f8fafc",
  appBackground: "#ffffff",
  cardBackground: "#f1f5f9",
  borderColor: "#e2e8f0",
};

export type ThemeColors = typeof darkColors;

export const getThemeColors = (mode: ThemeMode): ThemeColors =>
  mode === "dark" ? darkColors : lightColors;

export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _10: scale(10),
  _12: scale(12),
  _15: scale(15),
  _20: scale(20),
  _25: scale(25),
  _30: scale(30),
  _35: scale(35),
  _40: scale(40),
};

export const spacingY = {
  _5: verticalScale(5),
  _7: verticalScale(7),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _25: verticalScale(25),
  _30: verticalScale(30),
  _35: verticalScale(35),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
};

export const radius = {
  _3: verticalScale(3),
  _6: verticalScale(6),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _30: verticalScale(30),
};
