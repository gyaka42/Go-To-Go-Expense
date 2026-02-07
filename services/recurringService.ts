import { firestore } from "@/config/firebase";
import { TransactionType } from "@/types";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { createOrUpdateTransaction } from "./transactionService";

type RecurringInterval = "monthly" | "weekly";

type RecurringSchedule = {
  interval: RecurringInterval;
  dayOfMonth?: number;
  dayOfWeek?: number;
};

type RecurringDoc = {
  name?: string;
  walletId: string;
  type: string;
  amount: number;
  category?: string;
  description?: string;
  tags?: string[];
  schedule: RecurringSchedule;
  nextRunAt: Date | Timestamp;
  lastRunAt?: Date | Timestamp;
  isActive: boolean;
  createdAt: Date | Timestamp;
};

const recurringCollection = (uid: string) =>
  collection(firestore, "users", uid, "recurring");

const toDate = (value: Date | Timestamp): Date =>
  value instanceof Timestamp ? value.toDate() : value;

const daysInMonth = (year: number, monthIndex: number) =>
  new Date(year, monthIndex + 1, 0).getDate();

const nextMonthly = (base: Date, dayOfMonth: number) => {
  const next = new Date(base);
  next.setMonth(next.getMonth() + 1);
  const maxDay = daysInMonth(next.getFullYear(), next.getMonth());
  next.setDate(Math.min(dayOfMonth, maxDay));
  return next;
};

const nextWeekly = (base: Date) => {
  const next = new Date(base);
  next.setDate(next.getDate() + 7);
  return next;
};

const getNextRun = (schedule: RecurringSchedule, base: Date) => {
  if (schedule.interval === "weekly") {
    return nextWeekly(base);
  }
  const day = schedule.dayOfMonth ?? base.getDate();
  return nextMonthly(base, day);
};

export const createRecurringFromTransaction = async (
  uid: string,
  transaction: TransactionType
) => {
  const date =
    transaction.date instanceof Date || transaction.date instanceof Timestamp
      ? transaction.date
      : new Date(transaction.date);
  const baseDate = toDate(date);
  const schedule: RecurringSchedule = {
    interval: "monthly",
    dayOfMonth: baseDate.getDate(),
  };

  const docRef = doc(recurringCollection(uid));
  const payload: RecurringDoc = {
    walletId: transaction.walletId,
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description,
    tags: transaction.tags,
    schedule,
    nextRunAt: getNextRun(schedule, baseDate),
    lastRunAt: baseDate,
    isActive: true,
    createdAt: new Date(),
  };

  await setDoc(docRef, payload);
  return docRef.id;
};

export const processRecurring = async (uid: string) => {
  const now = new Date();
  const q = query(
    recurringCollection(uid),
    where("isActive", "==", true),
    where("nextRunAt", "<=", Timestamp.fromDate(now))
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data() as RecurringDoc;
    const runAt = toDate(data.nextRunAt);

    await createOrUpdateTransaction({
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: runAt,
      walletId: data.walletId,
      tags: data.tags,
      uid,
    });

    const nextRunAt = getNextRun(data.schedule, runAt);
    await updateDoc(docSnap.ref, {
      lastRunAt: runAt,
      nextRunAt,
    });
  }
};
