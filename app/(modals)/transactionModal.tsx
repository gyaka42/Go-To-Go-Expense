import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { ThemeColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { useLocalization } from "@/contexts/localizationContext";
import { useTheme } from "@/contexts/themeContext";
import useFetchData from "@/hooks/useFetchData";
import {
  createOrUpdateTransaction,
  deleteTransaction,
} from "@/services/transactionService";
import { TransactionType, WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const TransactionModal = () => {
  const router = useRouter();

  type paramType = {
    id: string;
    type: string;
    amount: string;
    category: string;
    date: string;
    description: string;
    image?: any;
    uid?: string;
    walletId: string;
  };

  const oldTransaction: paramType = useLocalSearchParams();

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: oldTransaction?.type,
        amount: Number(oldTransaction.amount),
        description: oldTransaction.description || "",
        category: oldTransaction.category || "",
        date: new Date(oldTransaction.date),
        walletId: oldTransaction.walletId,
        image: oldTransaction?.image ?? null,
      });
    }
  }, []);

  const { t } = useLocalization();
  const { colors, isDarkMode } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const constraints = useMemo(() => {
    if (!user?.uid) return [];
    return [where("uid", "==", user.uid), orderBy("created", "desc")];
  }, [user?.uid]);

  const { data: wallets } = useFetchData<WalletType>("wallets", constraints, [
    user?.uid,
  ]);

  const transactionTypeOptions = useMemo(
    () =>
      transactionTypes.map((option) => ({
        ...option,
        label: option.labelKey ? t(option.labelKey) : option.label,
      })),
    [t]
  );

  const expenseCategoryOptions = useMemo(
    () =>
      Object.values(expenseCategories).map((category) => ({
        ...category,
        label: category.labelKey ? t(category.labelKey) : category.label,
      })),
    [t]
  );

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS === "ios" ? true : false);
  };
  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;

    if (!walletId || !date || !amount || (type === "expense" && !category)) {
      Alert.alert(
        t("transactionModal.alertTitle"),
        t("auth.common.fillFields")
      );
      return;
    }

    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image,
      uid: user?.uid,
    };

    // include transaction id om te updaten komt hier
    if (oldTransaction?.id) transactionData.id = oldTransaction.id;
    setLoading(true);
    const res = await createOrUpdateTransaction(transactionData);

    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert(t("transactionModal.alertTitle"), res.msg);
    }
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteTransaction(
      oldTransaction?.id,
      oldTransaction.walletId
    );
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert(t("transactionModal.alertTitle"), res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      t("common.confirmation"),
      t("transactionModal.deleteConfirmMessage"),
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
            oldTransaction?.id
              ? t("transactionModal.titleEdit")
              : t("transactionModal.titleNew")
          }
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* Form */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          {/* Transaction Type */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral300} size={16}>
              {t("transactionModal.typeLabel")}
            </Typo>
            {/* DROPDOWN MENU */}
            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              //placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={transactionTypeOptions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              //placeholder={!isFocus ? "Select item" : "..."}
              value={transaction.type}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value });
              }}
            />
          </View>
          {/* Wallet input */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral300} size={16}>
              {t("transactionModal.walletLabel")}
            </Typo>
            {/* DROPDOWN MENU */}
            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={wallets.map((wallet) => ({
                label: `${wallet?.name} (€${Number(wallet.amount ?? 0).toFixed(
                  2
                )})`,
                value: wallet?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              placeholder={t("transactionModal.walletPlaceholder")}
              value={transaction.walletId}
              onChange={(item) => {
                setTransaction({ ...transaction, walletId: item.value || "" });
              }}
            />
          </View>

          {/* Expense category */}
          {transaction.type === "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral300} size={16}>
                {t("transactionModal.categoryLabel")}
              </Typo>
              {/* DROPDOWN MENU */}
              <Dropdown
                style={styles.dropdownContainer}
                activeColor={colors.neutral700}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                iconStyle={styles.dropdownIcon}
                data={expenseCategoryOptions}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                placeholder={t("transactionModal.categoryPlaceholder")}
                value={transaction.category}
                onChange={(item) => {
                  setTransaction({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
              />
            </View>
          )}

          {/* Date Picker */}

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral300} size={16}>
              {t("transactionModal.dateLabel")}
            </Typo>
            {/* Date input */}
            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}>
                  {(transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}

            {showDatePicker && (
              <View style={Platform.OS === "ios" && styles.iosDatePicker}>
                <DateTimePicker
                  themeVariant={isDarkMode ? "dark" : "light"}
                  value={transaction.date as Date}
                  textColor={colors.text}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo size={15} fontWeight={"500"}>
                      {t("common.ok")}
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* amount */}

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral300} size={16}>
              {t("transactionModal.amountLabel")}
            </Typo>
            <Input
              keyboardType="numeric"
              value={transaction.amount?.toString()}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral300} size={16}>
                {t("transactionModal.descriptionLabel")}
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                {t("transactionModal.optional")}
              </Typo>
            </View>

            <Input
              value={transaction.description}
              multiline
              containerStyle={{
                flexDirection: "row",
                height: verticalScale(100),
                alignItems: "flex-start",
                paddingVertical: 15,
              }}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral300} size={16}>
                {t("transactionModal.receiptLabel")}
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                {t("transactionModal.optional")}
              </Typo>
            </View>
            {/* image input */}
            <ImageUpload
              file={transaction.image}
              onClear={() => setTransaction({ ...transaction, image: null })}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              placeholder={t("wallet.modal.imagePlaceholder")}
            />
          </View>
        </ScrollView>
      </View>

      {/* footer */}
      <View style={styles.footer}>
        {oldTransaction?.id && (
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
            {oldTransaction?.id
              ? t("transactionModal.submitUpdate")
              : t("transactionModal.submitCreate")}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacingY._20,
    },
    form: {
      gap: spacingY._20,
      paddingVertical: spacingY._15,
      paddingBottom: spacingY._40,
    },
    footer: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: spacingX._20,
      gap: scale(12),
      paddingTop: spacingY._15,
      borderTopColor: colors.borderColor,
      borderWidth: 1,
      borderColor: colors.borderColor,
      marginBottom: spacingY._5,
      backgroundColor: colors.cardBackground,
    },
    inputContainer: {
      gap: spacingY._10,
    },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacingX._5,
    },
    dateInput: {
      flexDirection: "row",
      height: verticalScale(54),
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: radius._17,
      borderCurve: "continuous",
      paddingHorizontal: spacingX._15,
      backgroundColor: colors.cardBackground,
    },
    iosDatePicker: {
      backgroundColor: colors.cardBackground,
      borderRadius: radius._15,
    },
    datePickerButton: {
      backgroundColor: colors.cardBackground,
      alignSelf: "flex-end",
      padding: spacingY._7,
      marginRight: spacingX._7,
      paddingHorizontal: spacingX._15,
      borderRadius: radius._10,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    dropdownContainer: {
      height: verticalScale(54),
      borderWidth: 1,
      borderColor: colors.borderColor,
      paddingHorizontal: spacingX._15,
      borderRadius: radius._15,
      borderCurve: "continuous",
      backgroundColor: colors.cardBackground,
    },
    dropdownItemText: { color: colors.text },
    dropdownSelectedText: {
      color: colors.text,
      fontSize: verticalScale(14),
    },
    dropdownListContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: radius._15,
      borderCurve: "continuous",
      paddingVertical: spacingY._7,
      top: 5,
      borderColor: colors.borderColor,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 5,
    },
    dropdownPlaceholder: {
      color: colors.neutral400,
    },
    dropdownItemContainer: {
      borderRadius: radius._15,
      marginHorizontal: spacingX._7,
    },
    dropdownIcon: {
      height: verticalScale(30),
      tintColor: colors.neutral400,
    },
  });
