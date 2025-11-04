import type { Rule } from "./rulesEngine";

export const DEFAULT_RULES: Rule[] = [
  {
    id: "ah",
    label: "AH → Groceries",
    test: {
      type: "regex",
      value: "\\b(ah|albert ?heijn)\\b",
      field: "description",
    },
    categoryId: "groceries",
    enabled: true,
    priority: 10,
  },
  {
    id: "ns",
    label: "NS/GVB → Transport",
    test: {
      type: "regex",
      value: "\\b(ns|gvb|ov-chip)\\b",
      field: "description",
    },
    categoryId: "transport",
    enabled: true,
    priority: 20,
  },
];
