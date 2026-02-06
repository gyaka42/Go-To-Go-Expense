import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { expenseCategories, incomeCategory } from "@/constants/data";
import { ThemeColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useLocalization } from "@/contexts/localizationContext";
import { useTheme } from "@/contexts/themeContext";
import { useSharedWallet } from "@/src/sharedWallets/useSharedWallet";
import { verticalScale } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Activity, Transaction } from "./../../src/sharedWallets/types";

const WalletDetailScreen = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const walletId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { t } = useLocalization();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    wallet,
    loading,
    error,
    pendingTransactions,
    transactions,
    activity,
    inviteMember,
    approveTransaction,
    rejectTransaction,
    isOwner,
    isMember,
  } = useSharedWallet(walletId);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [submittingInvite, setSubmittingInvite] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const historyTransactions = useMemo(() => {
    return transactions
      .filter((txn) => txn.status !== "pending")
      .sort((a, b) => getDateValue(b.date) - getDateValue(a.date));
  }, [transactions]);

  const sortedActivity = useMemo(() => {
    return [...activity].sort(
      (a, b) => getDateValue(b.ts) - getDateValue(a.ts)
    );
  }, [activity]);

  const openAddTransaction = useCallback(() => {
    if (!walletId) return;
    router.push({
      pathname: "/(modals)/transactionModal",
      params: { walletId, sharedWallet: "1" },
    });
  }, [router, walletId]);

  const onInviteSubmit = useCallback(async () => {
    if (!inviteEmail.trim()) {
      Alert.alert(t("common.error"), t("auth.common.fillFields"));
      return;
    }
    try {
      setSubmittingInvite(true);
      await inviteMember(inviteEmail.trim());
      Alert.alert(t("common.confirmation"), t("sharedWallet.inviteSuccess"));
      setInviteEmail("");
      setInviteVisible(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      Alert.alert(t("common.error"), message);
    } finally {
      setSubmittingInvite(false);
    }
  }, [inviteEmail, inviteMember, t]);

  const handleApprove = useCallback(
    async (txnId: string) => {
      try {
        setActionLoading(`approve:${txnId}`);
        await approveTransaction(txnId);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        Alert.alert(t("common.error"), message);
      } finally {
        setActionLoading(null);
      }
    },
    [approveTransaction, t]
  );

  const handleReject = useCallback(
    async (txnId: string) => {
      try {
        setActionLoading(`reject:${txnId}`);
        await rejectTransaction(txnId);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        Alert.alert(t("common.error"), message);
      } finally {
        setActionLoading(null);
      }
    },
    [rejectTransaction, t]
  );

  const renderTransaction = useCallback(
    (txn: Transaction) => {
      const category = getCategoryLabel(txn, t);
      const amountLabel = formatAmount(txn);
      const dateLabel = formatDate(txn.date);
      return (
        <View key={txn.id} style={styles.transactionCard}>
          <View style={{ flex: 1 }}>
            <Typo size={16} fontWeight={"500"}>
              {category}
            </Typo>
            {txn.description ? (
              <Typo color={colors.neutral400}>{txn.description}</Typo>
            ) : null}
          </View>
          <View style={styles.transactionMeta}>
            <Typo
              fontWeight={"600"}
              color={txn.type === "income" ? colors.green : colors.rose}
            >
              {amountLabel}
            </Typo>
            <Typo color={colors.neutral400} size={11}>
              {dateLabel}
            </Typo>
            <View
              style={[styles.statusBadge, getStatusStyle(txn.status, colors)]}
            >
              <Typo size={11} color={colors.black}>
                {t(`sharedWallet.status.${txn.status}`)}
              </Typo>
            </View>
          </View>
        </View>
      );
    },
    [
      colors,
      styles.transactionCard,
      styles.transactionMeta,
      styles.statusBadge,
      t,
    ]
  );

  const renderPending = useCallback(
    (txn: Transaction) => (
      <View key={txn.id} style={styles.pendingCard}>
        <View style={{ flex: 1 }}>
          <Typo size={16} fontWeight={"500"}>
            {getCategoryLabel(txn, t)}
          </Typo>
          {txn.description ? (
            <Typo color={colors.neutral400}>{txn.description}</Typo>
          ) : null}
          <Typo color={colors.neutral400} size={11}>
            {formatDate(txn.date)}
          </Typo>
        </View>
        <View style={styles.pendingActions}>
          <TouchableOpacity
            style={[styles.pendingButton, styles.approveButton]}
            onPress={() => handleApprove(txn.id)}
            disabled={actionLoading === `approve:${txn.id}`}
          >
            {actionLoading === `approve:${txn.id}` ? (
              <ActivityIndicator color={colors.black} size="small" />
            ) : (
              <Typo color={colors.black}>{t("sharedWallet.approve")}</Typo>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pendingButton, styles.rejectButton]}
            onPress={() => handleReject(txn.id)}
            disabled={actionLoading === `reject:${txn.id}`}
          >
            {actionLoading === `reject:${txn.id}` ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Typo color={colors.white}>{t("sharedWallet.reject")}</Typo>
            )}
          </TouchableOpacity>
        </View>
      </View>
    ),
    [actionLoading, colors, handleApprove, handleReject, styles, t]
  );

  const renderActivity = useCallback(
    (event: Activity) => {
      const isAlert = event.type === "transaction_large";
      return (
        <View key={event.id} style={styles.activityItem}>
          <View style={styles.activityHeader}>
            <Typo fontWeight={"500"}>{event.message}</Typo>
            {isAlert ? (
              <View style={styles.alertBadge}>
                <Typo size={10} color={colors.white}>
                  {t("sharedWallet.activityAlert")}
                </Typo>
              </View>
            ) : null}
          </View>
          <Typo size={11} color={colors.neutral400}>
            {formatDate(event.ts)}
          </Typo>
        </View>
      );
    },
    [colors.neutral400, colors.white, styles, t]
  );

  const currency = wallet?.currency ?? "EUR";
  const memberCount = wallet?.memberIds?.length ?? 0;
  const ownerCount = wallet?.ownerIds?.length ?? 0;

  return (
    <ScreenWrapper style={{ backgroundColor: colors.cardBackground }}>
      <View style={styles.container}>
        <Header
          title={wallet?.name ?? t("wallet.myWallets")}
          leftIcon={<BackButton />}
        />

        {error ? <Typo color={colors.rose}>{error}</Typo> : null}

        {loading ? (
          <View style={styles.centered}>
            <Loading />
          </View>
        ) : !isMember ? (
          <View style={styles.centered}>
            <Typo>{t("sharedWallet.noAccess")}</Typo>
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.summaryCard}>
              <Typo size={16} fontWeight={"500"}>
                {t("sharedWallet.currencyLabel", { currency })}
              </Typo>
              <Typo color={colors.neutral400}>
                {t("sharedWallet.owners", { count: ownerCount })}
              </Typo>
              <Typo color={colors.neutral400}>
                {t("sharedWallet.members", { count: memberCount })}
              </Typo>
            </View>

            <View style={styles.sectionHeader}>
              <Typo size={20} fontWeight={"600"}>
                {t("sharedWallet.transactionsTitle")}
              </Typo>
              <Button style={styles.addButton} onPress={openAddTransaction}>
                <Typo color={colors.black} fontWeight={"600"}>
                  {t("sharedWallet.addTransaction")}
                </Typo>
              </Button>
            </View>

            {isOwner && (
              <View style={styles.section}>
                <Typo size={18} fontWeight={"600"}>
                  {t("sharedWallet.pendingTitle")}
                </Typo>
                {pendingTransactions.length === 0 ? (
                  <Typo color={colors.neutral400}>
                    {t("sharedWallet.pendingEmpty")}
                  </Typo>
                ) : (
                  pendingTransactions.map(renderPending)
                )}
              </View>
            )}

            <View style={styles.section}>
              {historyTransactions.length === 0 ? (
                <Typo color={colors.neutral400}>
                  {t("sharedWallet.transactionsEmpty")}
                </Typo>
              ) : (
                historyTransactions.map(renderTransaction)
              )}
            </View>

            <View style={styles.sectionHeader}>
              <Typo size={20} fontWeight={"600"}>
                {t("sharedWallet.activityTitle")}
              </Typo>
              {isOwner ? (
                <Button
                  style={styles.inviteButton}
                  onPress={() => setInviteVisible(true)}
                >
                  <Typo color={colors.black} fontWeight={"600"}>
                    {t("sharedWallet.inviteButton")}
                  </Typo>
                </Button>
              ) : null}
            </View>

            <View style={styles.section}>
              {sortedActivity.length === 0 ? (
                <Typo color={colors.neutral400}>
                  {t("sharedWallet.activityEmpty")}
                </Typo>
              ) : (
                sortedActivity.map(renderActivity)
              )}
            </View>
          </ScrollView>
        )}
      </View>

      <InviteMemberModal
        visible={inviteVisible}
        onClose={() => setInviteVisible(false)}
        email={inviteEmail}
        onChangeEmail={setInviteEmail}
        onSubmit={onInviteSubmit}
        submitting={submittingInvite}
      />
    </ScreenWrapper>
  );
};

const InviteMemberModal = ({
  visible,
  onClose,
  email,
  onChangeEmail,
  onSubmit,
  submitting,
}: {
  visible: boolean;
  onClose: () => void;
  email: string;
  onChangeEmail: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          <Typo size={18} fontWeight={"600"}>
            {t("sharedWallet.inviteButton")}
          </Typo>
          <Typo color={colors.neutral400}>
            {t("sharedWallet.inviteDescription")}
          </Typo>
          <Input
            placeholder="email@example.com"
            value={email}
            onChangeText={onChangeEmail}
          />
          <View style={styles.modalActions}>
            <Button style={{ flex: 1 }} onPress={onClose}>
              <Typo color={colors.black}>{t("sharedWallet.inviteCancel")}</Typo>
            </Button>
            <Button style={{ flex: 1 }} onPress={onSubmit} loading={submitting}>
              <Typo color={colors.black} fontWeight={"600"}>
                {t("sharedWallet.inviteSubmit")}
              </Typo>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

function getDateValue(value: Timestamp): number {
  if (value instanceof Timestamp) {
    return value.toMillis();
  }
  return new Date(value as unknown as string).getTime();
}

function formatDate(value: Timestamp): string {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale || "nl-NL";
  const date = value instanceof Timestamp ? value.toDate() : new Date(value);
  return date.toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(txn: Transaction): string {
  const amount = Number(txn.amount || 0).toFixed(2);
  return `${txn.type === "income" ? "+" : "-"} € ${amount}`;
}

function getCategoryLabel(
  txn: Transaction,
  t: ReturnType<typeof useLocalization>["t"]
): string {
  if (txn.type === "income") {
    return incomeCategory.labelKey
      ? t(incomeCategory.labelKey)
      : incomeCategory.label;
  }
  if (txn.categoryId && expenseCategories[txn.categoryId]) {
    const category = expenseCategories[txn.categoryId];
    return category.labelKey ? t(category.labelKey) : category.label;
  }
  return t("categories.others");
}

function getStatusStyle(status: Transaction["status"], colors: ThemeColors) {
  switch (status) {
    case "approved":
      return { backgroundColor: colors.primaryLight };
    case "rejected":
      return { backgroundColor: colors.rose };
    default:
      return { backgroundColor: colors.neutral400 };
  }
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacingX._20,
      paddingTop: spacingY._15,
    },
    contentContainer: {
      gap: spacingY._20,
      paddingBottom: spacingY._30,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    summaryCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: radius._15,
      borderCurve: "continuous",
      padding: spacingX._20,
      borderWidth: 1,
      borderColor: colors.borderColor,
      gap: spacingY._5,
    },
    section: {
      backgroundColor: colors.cardBackground,
      borderRadius: radius._15,
      borderCurve: "continuous",
      padding: spacingX._20,
      borderWidth: 1,
      borderColor: colors.borderColor,
      gap: spacingY._15,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    addButton: {
      paddingHorizontal: spacingX._15,
      height: verticalScale(44),
    },
    inviteButton: {
      paddingHorizontal: spacingX._15,
      height: verticalScale(44),
    },
    pendingCard: {
      backgroundColor: colors.appBackground,
      borderRadius: radius._12,
      borderCurve: "continuous",
      padding: spacingX._15,
      borderWidth: 1,
      borderColor: colors.borderColor,
      flexDirection: "row",
      gap: spacingX._10,
      alignItems: "center",
    },
    pendingActions: {
      gap: spacingY._10,
    },
    pendingButton: {
      width: verticalScale(100),
      height: verticalScale(36),
      borderRadius: radius._10,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
    },
    approveButton: {
      backgroundColor: colors.primaryLight,
    },
    rejectButton: {
      backgroundColor: colors.rose,
    },
    transactionCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacingX._15,
    },
    transactionMeta: {
      alignItems: "flex-end",
      gap: 4,
    },
    statusBadge: {
      borderRadius: radius._6,
      borderCurve: "continuous",
      paddingHorizontal: spacingX._5,
      paddingVertical: 2,
    },
    activityItem: {
      padding: spacingX._15,
      backgroundColor: colors.appBackground,
      borderRadius: radius._12,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: colors.borderColor,
      gap: spacingY._5,
    },
    activityHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacingX._10,
    },
    alertBadge: {
      backgroundColor: colors.rose,
      borderRadius: radius._6,
      borderCurve: "continuous",
      paddingHorizontal: spacingX._7,
      paddingVertical: 2,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
      padding: spacingX._20,
    },
    modalContent: {
      backgroundColor: colors.cardBackground,
      padding: spacingX._20,
      borderRadius: radius._15,
      borderCurve: "continuous",
      gap: spacingY._10,
      width: "100%",
    },
    modalActions: {
      flexDirection: "row",
      gap: spacingX._10,
    },
  });

export default WalletDetailScreen;
