import { auth, firestore } from "@/config/firebase";
import {
  normalizeEmail,
  saveEmailDirectoryEntry,
} from "@/services/emailDirectory";
import { AuthContextType, UserType } from "@/types";
import { useRouter } from "expo-router";
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("firebase user", firebaseUser);
      if (firebaseUser) {
        setUser({
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          name: firebaseUser?.displayName,
        });
        updateUserData(firebaseUser.uid);
        router.replace("/(tabs)");
      } else {
        // no user
        setUser(null);
        router.replace("/(auth)/welcome");
      }
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: unknown) {
      let msg = error instanceof Error ? error.message : String(error);
      console.log("error message: ", msg);
      if (msg.includes("(auth/invalid-credential)"))
        msg = "Onjuiste inloggegevens";
      if (msg.includes("(auth/invalid-email)")) msg = "Onjuiste E-mailadres";
      return { success: false, msg };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const normalizedEmail = normalizeEmail(email);
      await setDoc(doc(firestore, "users", response.user.uid), {
        name,
        email: normalizedEmail,
        uid: response.user.uid,
      });
      await saveEmailDirectoryEntry(response.user.uid, normalizedEmail);
      return { success: true };
    } catch (error: unknown) {
      let msg = error instanceof Error ? error.message : String(error);
      console.log("error message: ", msg);
      if (msg.includes("(auth/email-already-in-use)"))
        msg = "E-mailadres al in gebruik.";
      if (msg.includes("(auth/invalid-email)")) msg = "Onjuiste E-mailadres";
      return { success: false, msg };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: unknown) {
      let msg = error instanceof Error ? error.message : String(error);
      console.log("error message: ", msg);
      if (msg.includes("(auth/invalid-email)")) msg = "Onjuist e-mailadres.";
      if (msg.includes("(auth/user-not-found)"))
        msg = "Geen account gevonden voor dit e-mailadres.";
      return { success: false, msg };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) {
      return {
        success: false,
        msg: "Geen gebruiker aangemeld.",
      };
    }

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      return { success: true };
    } catch (error: unknown) {
      let msg = error instanceof Error ? error.message : String(error);
      console.log("changePassword error:", msg);

      if (
        msg.includes("(auth/wrong-password)") ||
        msg.includes("(auth/invalid-credential)")
      ) {
        msg = "Het huidige wachtwoord is onjuist.";
      }

      if (msg.includes("(auth/weak-password)")) {
        msg = "Het nieuwe wachtwoord is te zwak.";
      }

      if (msg.includes("(auth/too-many-requests)")) {
        msg = "Te veel pogingen. Probeer het later opnieuw.";
      }

      return { success: false, msg };
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data?.uid,
          email: data.email || null,
          name: data.name || null,
          image: data.image || null,
        };
        setUser({ ...userData });
        try {
          await saveEmailDirectoryEntry(
            uid,
            (data.email as string | undefined | null) ??
              auth.currentUser?.email ??
              null
          );
        } catch (error) {
          console.error("Failed to sync email directory entry:", error);
        }
      }
    } catch (error: unknown) {
      console.error("updateUserData error:", error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    resetPassword,
    updateUserData,
    changePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be wrapped inside AuthProvider");
  }
  return context;
};
