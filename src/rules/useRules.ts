import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { DEFAULT_RULES } from "./defaultRules";
import { Rule, setActiveRules, sortRules } from "./rulesEngine";

const STORAGE_KEY = "rules/user-defined";

export type UseRulesActions = {
  addRule: (rule: Rule) => Promise<void>;
  updateRule: (ruleId: string, updates: Partial<Rule>) => Promise<void>;
  removeRule: (ruleId: string) => Promise<void>;
  resetToDefault: () => Promise<void>;
};

export function useRules(): [Rule[], UseRulesActions] {
  const [rules, setRules] = useState<Rule[]>(sortRules(DEFAULT_RULES));
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadRules = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedValue) {
          const parsed: Rule[] = JSON.parse(storedValue);
          if (Array.isArray(parsed)) {
            const sorted = sortRules(parsed);
            setRules(sorted);
            setActiveRules(sorted);
            setIsHydrated(true);
            return;
          }
        }
      } catch (error) {
        console.warn("Failed to read stored rules", error);
      }

      const defaults = sortRules(DEFAULT_RULES);
      setRules(defaults);
      setActiveRules(defaults);
      setIsHydrated(true);
    };

    loadRules();
  }, []);

  const persistRules = useCallback(async (nextRules: Rule[]) => {
    const sorted = sortRules(nextRules);
    setRules(sorted);
    setActiveRules(sorted);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
    } catch (error) {
      console.warn("Failed to persist rules", error);
    }
  }, []);

  const addRule = useCallback<UseRulesActions["addRule"]>(
    async (rule) => {
      await persistRules([...rules, rule]);
    },
    [persistRules, rules]
  );

  const updateRule = useCallback<UseRulesActions["updateRule"]>(
    async (ruleId, updates) => {
      await persistRules(
        rules.map((rule) =>
          rule.id === ruleId
            ? {
                ...rule,
                ...updates,
              }
            : rule
        )
      );
    },
    [persistRules, rules]
  );

  const removeRule = useCallback<UseRulesActions["removeRule"]>(
    async (ruleId) => {
      await persistRules(rules.filter((rule) => rule.id !== ruleId));
    },
    [persistRules, rules]
  );

  const resetToDefault = useCallback<
    UseRulesActions["resetToDefault"]
  >(async () => {
    const defaults = sortRules(DEFAULT_RULES);
    setRules(defaults);
    setActiveRules(defaults);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear stored rules", error);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    setActiveRules(rules);
  }, [isHydrated, rules]);

  return [rules, { addRule, updateRule, removeRule, resetToDefault }];
}
