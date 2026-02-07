import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { ThemeColors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { useLocalization } from "@/contexts/localizationContext";
import { useTheme } from "@/contexts/themeContext";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

const WalletModal = () => {
  const router = useRouter();

  const oldWallet: {
    name: string;
    image: string;
    id: string;
    currency?: string;
    limits?: string;
  } = useLocalSearchParams();
  useEffect(() => {
    if (oldWallet?.id) {
      let parsedLimits: { daily?: number; weekly?: number } | undefined;
      if (oldWallet?.limits) {
        try {
          parsedLimits = JSON.parse(oldWallet.limits);
        } catch {
          parsedLimits = undefined;
        }
      }
      setWallet({
        name: oldWallet?.name,
        image: oldWallet?.image,
        currency: oldWallet?.currency || "EUR",
        limits: parsedLimits,
      });
    }
  }, []);

  const { user } = useAuth();
  const { t } = useLocalization();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
    currency: "EUR",
    limits: {
      daily: undefined,
      weekly: undefined,
    },
  });

  const onSubmit = async () => {
    let { name, image, currency, limits } = wallet;
    if (!name.trim()) {
      Alert.alert(t("wallet.modal.alertTitle"), t("auth.common.fillFields"));
      return;
    }

    const data: WalletType = {
      name,
      image: image ?? null,
      uid: user?.uid,
      currency: currency || "EUR",
      limits: {
        daily: limits?.daily ? Number(limits.daily) : undefined,
        weekly: limits?.weekly ? Number(limits.weekly) : undefined,
      },
    };

    if (!oldWallet?.id && user?.uid) {
      data.ownerIds = [user.uid];
    }

    if (oldWallet?.id) data.id = oldWallet.id;

    setLoading(true);
    const res = await createOrUpdateWallet(data);
    setLoading(false);
    console.log("result: ", res);
    if (res.success) {
      router.back();
    } else {
      Alert.alert(t("wallet.modal.alertTitle"), res.msg);
    }
  };

  const onDelete = async () => {
    if (!oldWallet?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldWallet?.id);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert(t("wallet.modal.alertTitle"), res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      t("common.confirmation"),
      t("wallet.modal.deleteConfirmMessage"),
      [
        {
          text: t("common.cancel"),
          onPress: () => console.log("Annuleer verwijderen"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          onPress: () => onDelete(),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={
            oldWallet?.id
              ? t("wallet.modal.titleEdit")
              : t("wallet.modal.titleNew")
          }
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* Form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.text}>{t("wallet.modal.nameLabel")}</Typo>
            <Input
              placeholder={t("wallet.modal.namePlaceholder")}
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.text}>{t("wallet.modal.currencyLabel")}</Typo>
            <Input
              placeholder="EUR"
              value={wallet.currency || ""}
              autoCapitalize="characters"
              onChangeText={(value) =>
                setWallet({ ...wallet, currency: value.toUpperCase() })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.text}>{t("wallet.modal.dailyLimitLabel")}</Typo>
            <Input
              placeholder={t("wallet.modal.dailyLimitPlaceholder")}
              keyboardType="numeric"
              value={
                wallet.limits?.daily != null
                  ? String(wallet.limits?.daily)
                  : ""
              }
              onChangeText={(value) =>
                setWallet({
                  ...wallet,
                  limits: {
                    ...wallet.limits,
                    daily: value
                      ? Number(value.replace(/[^0-9.]/g, ""))
                      : undefined,
                  },
                })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.text}>{t("wallet.modal.weeklyLimitLabel")}</Typo>
            <Input
              placeholder={t("wallet.modal.weeklyLimitPlaceholder")}
              keyboardType="numeric"
              value={
                wallet.limits?.weekly != null
                  ? String(wallet.limits?.weekly)
                  : ""
              }
              onChangeText={(value) =>
                setWallet({
                  ...wallet,
                  limits: {
                    ...wallet.limits,
                    weekly: value
                      ? Number(value.replace(/[^0-9.]/g, ""))
                      : undefined,
                  },
                })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.text}>{t("wallet.modal.iconLabel")}</Typo>
            {/* image input */}
            <ImageUpload
              file={wallet.image}
              onClear={() => setWallet({ ...wallet, image: null })}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              placeholder={t("wallet.modal.imagePlaceholder")}
            />
          </View>
        </ScrollView>
      </View>

      {/* footer */}
      <View style={styles.footer}>
        {oldWallet?.id && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.TrashIcon
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button loading={loading} onPress={onSubmit} style={{ flex: 1 }}>
          <Typo size={18} color={colors.black} fontWeight={"600"}>
            {oldWallet?.id
              ? t("wallet.modal.submitUpdate")
              : t("wallet.modal.submitCreate")}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: spacingY._30,
    },
    footer: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: spacingX._20,
      gap: scale(12),
      paddingTop: spacingY._15,
      borderTopColor: colors.borderColor,
      marginBottom: spacingY._5,
      borderWidth: 1,
      borderColor: colors.borderColor,
      backgroundColor: colors.cardBackground,
    },
    form: {
      gap: spacingY._30,
      marginTop: spacingY._15,
    },
    inputContainer: {
      gap: spacingY._10,
    },
  });
