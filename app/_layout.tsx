import { AuthProvider } from "@/contexts/authContext";
import { LocalizationProvider } from "@/contexts/localizationContext";
import { ThemeProvider } from "@/contexts/themeContext";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(modals)/profileModal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/walletModal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/transactionModal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/privacyPolicyModal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/settingsModal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/searchModal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LocalizationProvider>
        <AuthProvider>
          <StackLayout />
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
