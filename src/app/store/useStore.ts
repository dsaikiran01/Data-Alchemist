import { create } from "zustand";
import { Rule } from "@/types/rules";

interface RuleState {
  rules: Rule[];
  addRule: (rule: Rule) => void;
  deleteRule: (index: number) => void;
  resetRules: () => void;
}

export const useRuleStore = create<RuleState>((set) => ({
  rules: [],
  addRule: (rule) => set((state) => ({ rules: [...state.rules, rule] })),
  deleteRule: (index) =>
    set((state) => ({
      rules: state.rules.filter((_, i) => i !== index),
    })),
  resetRules: () => set({ rules: [] }),
}));
