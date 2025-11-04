import { DEFAULT_RULES } from "./defaultRules";

export type Rule = {
  id: string;
  label: string;
  test: {
    type: "string" | "regex";
    value: string;
    field?: "description" | "merchant";
  };
  categoryId: string;
  enabled: boolean;
  priority: number;
};

let activeRules: Rule[] = [];

function normalise(value?: string | null): string {
  return (value ?? "").toLowerCase();
}

function getFieldValue(
  rule: Rule,
  input: { description?: string; merchant?: string }
): string {
  const field = rule.test.field ?? "description";
  if (field === "merchant") {
    return input.merchant ?? "";
  }
  return input.description ?? "";
}

function ensureActiveRules(): Rule[] {
  if (!activeRules.length) {
    activeRules = sortRules(DEFAULT_RULES);
  }
  return activeRules;
}

export function setActiveRules(rules: Rule[]): void {
  activeRules = sortRules(rules);
}

export function getActiveRules(): Rule[] {
  return ensureActiveRules();
}

export function sortRules(rules: Rule[]): Rule[] {
  return [...rules].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.label.localeCompare(b.label);
  });
}

function matchRule(rule: Rule, inputValue: string): boolean {
  if (!inputValue) {
    return false;
  }

  if (rule.test.type === "string") {
    return normalise(inputValue).includes(normalise(rule.test.value));
  }

  try {
    const regex = new RegExp(rule.test.value, "i");
    return regex.test(inputValue);
  } catch (error) {
    console.warn(`Invalid regex in rule ${rule.id}`, error);
    return false;
  }
}

export function applyRules(input: {
  description?: string;
  merchant?: string;
}): string | undefined {
  const rules = ensureActiveRules();
  for (const rule of rules) {
    if (!rule.enabled) continue;
    const valueToTest = getFieldValue(rule, input);
    if (matchRule(rule, valueToTest)) {
      return rule.categoryId;
    }
  }

  return undefined;
}
