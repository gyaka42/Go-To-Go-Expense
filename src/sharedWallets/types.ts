import { Timestamp } from "firebase/firestore";

export type Wallet = {
  id: string;
  name: string;
  currency: string;
  ownerIds: string[];
  memberIds: string[];
  participantIds?: string[];
  createdAt: Timestamp;
};

export type TransactionStatus = "approved" | "pending" | "rejected";

export type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  categoryId?: string;
  description?: string;
  date: Timestamp;
  createdBy: string;
  status: TransactionStatus;
  approvedBy?: string;
  approvedAt?: Timestamp;
};

export type NewTxn = {
  amount: number;
  type: "income" | "expense";
  categoryId?: string;
  description?: string;
  date: Date | Timestamp;
  createdBy: string;
};

export type ActivityType =
  | "transaction_created"
  | "transaction_approved"
  | "transaction_rejected"
  | "transaction_large"
  | "member_invited"
  | "member_joined";

export type Activity = {
  id: string;
  type: ActivityType;
  actorId: string;
  targetId?: string;
  message: string;
  ts: Timestamp;
};
