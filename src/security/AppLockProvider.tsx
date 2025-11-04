import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Typo from "@/components/Typo";
import { ThemeColors } from "@/constants/theme";
import { useTheme } from "@/contexts/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import * as LocalAuthentication from "expo-local-authentication";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, AppStateStatus, StyleSheet, View } from "react-native";

const STORAGE_KEY = "app-lock/require-on-launch";

type AppLockContextValue = {
  isUnlocked: boolean;
  ensureUnlocked: (reason?: string) => Promise<boolean>;
  setRequireLockOnLaunch: (value: boolean) => Promise<void>;
  requireLockOnLaunch: boolean;
  requireWalletUnlock: (walletId: string) => Promise<boolean>;
};

const AppLockContext = createContext<AppLockContextValue | null>(null);

type WalletUnlockState = Record<string, boolean>;

const defaultPromptMessage = "Ontgrendel de app";
const walletPromptMessage = "Ontgrendel wallet";

async function supportsBiometrics() {
  try {
    const [isSupported, isEnrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ]);
    return isSupported && isEnrolled;
  } catch (error) {
    console.warn("Failed to determine biometric support", error);
    return false;
  }
}

export const AppLockProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [requireLockOnLaunch, setRequireLockOnLaunchState] =
    useState<boolean>(true);
  const walletUnlocks = useRef<WalletUnlockState>({});
  const hasAttemptedInitialUnlock = useRef(false);

  const runAuthentication = useCallback(async (promptMessage: string) => {
    const biometricAvailable = await supportsBiometrics();
    if (!biometricAvailable) {
      setIsUnlocked(true);
      return true;
    }

    setIsAuthenticating(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: "Annuleer",
        disableDeviceFallback: false,
      });
      const success = result.success === true;
      setIsUnlocked(success);
      if (!success) {
        walletUnlocks.current = {};
      }
      return success;
    } catch (error) {
      console.warn("Biometric authentication failed", error);
      setIsUnlocked(false);
      walletUnlocks.current = {};
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const ensureUnlocked = useCallback(
    async (reason?: string) => {
      if (isUnlocked) return true;
      const prompt = reason ?? defaultPromptMessage;
      return runAuthentication(prompt);
    },
    [isUnlocked, runAuthentication]
  );

  const requireWalletUnlock = useCallback(
    async (walletId: string) => {
      if (!walletId) {
        return runAuthentication(walletPromptMessage);
      }
      if (walletUnlocks.current[walletId]) return true;

      const success = await runAuthentication(walletPromptMessage);
      if (success) {
        walletUnlocks.current = {
          ...walletUnlocks.current,
          [walletId]: true,
        };
      }
      return success;
    },
    [runAuthentication]
  );

  const setRequireLockOnLaunch = useCallback(
    async (value: boolean) => {
      setRequireLockOnLaunchState(value);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch (error) {
        console.warn("Failed to persist app lock preference", error);
      }
      if (!value) {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
        hasAttemptedInitialUnlock.current = false;
        await runAuthentication(defaultPromptMessage);
      }
    },
    [runAuthentication]
  );

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw != null) {
          const parsed = JSON.parse(raw);
          if (typeof parsed === "boolean") {
            setRequireLockOnLaunchState(parsed);
            if (!parsed) {
              setIsUnlocked(true);
              hasAttemptedInitialUnlock.current = true;
            }
          }
        }
      } catch (error) {
        console.warn("Failed to load app lock preference", error);
        setIsUnlocked(true);
      }
    };
    loadPreference();
  }, []);

  useEffect(() => {
    if (!requireLockOnLaunch || hasAttemptedInitialUnlock.current) {
      return;
    }
    hasAttemptedInitialUnlock.current = true;
    ensureUnlocked();
  }, [ensureUnlocked, requireLockOnLaunch]);

  useEffect(() => {
    const handleAppStateChange = async (nextState: AppStateStatus) => {
      if (nextState === "active") {
        if (requireLockOnLaunch) {
          walletUnlocks.current = {};
          await ensureUnlocked();
        } else {
          setIsUnlocked(true);
        }
      } else if (nextState === "background" || nextState === "inactive") {
        if (requireLockOnLaunch) {
          setIsUnlocked(false);
        }
        walletUnlocks.current = {};
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => subscription.remove();
  }, [ensureUnlocked, requireLockOnLaunch]);

  const contextValue = useMemo<AppLockContextValue>(
    () => ({
      isUnlocked,
      ensureUnlocked,
      setRequireLockOnLaunch,
      requireLockOnLaunch,
      requireWalletUnlock,
    }),
    [ensureUnlocked, isUnlocked, requireLockOnLaunch, requireWalletUnlock]
  );

  return (
    <AppLockContext.Provider value={contextValue}>
      <View style={{ flex: 1 }}>
        {children}
        {requireLockOnLaunch && !isUnlocked && (
          <BlurView intensity={60} tint="dark" style={styles.overlay}>
            <View style={styles.overlayContent}>
              <Typo size={18} fontWeight="600" color={colors.white}>
                {"Vergrendeld"}
              </Typo>
              <Typo color={colors.white} style={styles.overlayDescription}>
                {"Gebruik Face ID/Touch ID om toegang te krijgen."}
              </Typo>
              <View style={styles.loader}>
                {isAuthenticating ? <Loading /> : null}
              </View>
              <Button
                style={styles.retryButton}
                onPress={() => ensureUnlocked()}
                loading={isAuthenticating}
              >
                <Typo color={colors.black} fontWeight="600">
                  {"Opnieuw proberen"}
                </Typo>
              </Button>
            </View>
          </BlurView>
        )}
      </View>
    </AppLockContext.Provider>
  );
};

export const useAppLock = (): AppLockContextValue => {
  const context = useContext(AppLockContext);
  if (!context) {
    throw new Error("useAppLock must be used within an AppLockProvider");
  }
  return context;
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    },
    overlayContent: {
      padding: 24,
      alignItems: "center",
      gap: 16,
    },
    overlayDescription: {
      textAlign: "center",
    },
    loader: {
      height: 48,
      justifyContent: "center",
      alignItems: "center",
    },
    retryButton: {
      width: 200,
    },
  });
