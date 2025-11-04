import { useAuth } from "@/contexts/authContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addTransaction,
  approveTransaction,
  inviteMember,
  listenActivity,
  listenTransactions,
  listenWallet,
  rejectTransaction,
} from "./firestore";
import { Activity, NewTxn, Transaction, Wallet } from "./types";

export type UseSharedWalletResult = {
  wallet: Wallet | null;
  loading: boolean;
  error?: string;
  transactions: Transaction[];
  pendingTransactions: Transaction[];
  approvedTransactions: Transaction[];
  activity: Activity[];
  inviteMember: (email: string) => Promise<void>;
  approveTransaction: (txnId: string) => Promise<void>;
  rejectTransaction: (txnId: string) => Promise<void>;
  addTransaction: (txn: Omit<NewTxn, "createdBy">) => Promise<string>;
  isOwner: boolean;
  isMember: boolean;
};

export function useSharedWallet(walletId?: string): UseSharedWalletResult {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(walletId));
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!walletId) {
      setWallet(null);
      setTransactions([]);
      setActivity([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(undefined);

    const unsubscribeWallet = listenWallet(walletId, (nextWallet) => {
      setWallet(nextWallet);
      setLoading(false);
    });

    const unsubscribeTransactions = listenTransactions(walletId, (items) => {
      setTransactions(items);
    });

    const unsubscribeActivity = listenActivity(walletId, (events) => {
      setActivity(events);
    });

    return () => {
      unsubscribeWallet();
      unsubscribeTransactions();
      unsubscribeActivity();
    };
  }, [walletId]);

  const isOwner = useMemo(() => {
    if (!wallet?.ownerIds || !user?.uid) return false;
    return wallet.ownerIds.includes(user.uid);
  }, [wallet?.ownerIds, user?.uid]);

  const isMember = useMemo(() => {
    if (!wallet || !user?.uid) return false;
    return (
      wallet.ownerIds.includes(user.uid) || wallet.memberIds.includes(user.uid)
    );
  }, [wallet, user?.uid]);

  const pendingTransactions = useMemo(
    () => transactions.filter((txn) => txn.status === "pending"),
    [transactions]
  );

  const approvedTransactions = useMemo(
    () => transactions.filter((txn) => txn.status === "approved"),
    [transactions]
  );

  const handleInvite = useCallback<UseSharedWalletResult["inviteMember"]>(
    async (email) => {
      if (!walletId) throw new Error("Wallet niet gevonden");
      try {
        await inviteMember(walletId, email);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        throw err;
      }
    },
    [walletId]
  );

  const handleApprove = useCallback<
    UseSharedWalletResult["approveTransaction"]
  >(
    async (txnId) => {
      if (!walletId || !user?.uid)
        throw new Error("Wallet of gebruiker ontbreekt");
      await approveTransaction(walletId, txnId, user.uid);
    },
    [walletId, user?.uid]
  );

  const handleReject = useCallback<UseSharedWalletResult["rejectTransaction"]>(
    async (txnId) => {
      if (!walletId || !user?.uid)
        throw new Error("Wallet of gebruiker ontbreekt");
      await rejectTransaction(walletId, txnId, user.uid);
    },
    [walletId, user?.uid]
  );

  const handleAddTransaction = useCallback<
    UseSharedWalletResult["addTransaction"]
  >(
    async (txn) => {
      if (!walletId || !user?.uid)
        throw new Error("Wallet of gebruiker ontbreekt");
      return addTransaction(walletId, {
        ...txn,
        createdBy: user.uid,
      });
    },
    [walletId, user?.uid]
  );

  return {
    wallet,
    loading,
    error,
    transactions,
    pendingTransactions,
    approvedTransactions,
    activity,
    inviteMember: handleInvite,
    approveTransaction: handleApprove,
    rejectTransaction: handleReject,
    addTransaction: handleAddTransaction,
    isOwner,
    isMember,
  };
}
