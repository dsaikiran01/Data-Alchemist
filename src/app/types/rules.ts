export type RuleType =
  | "coRun"
  | "phaseWindow"
  | "loadLimit"
  | "slotRestriction"
  | "patternMatch"
  | "precedence";

export interface CoRunRule {
  type: "coRun";
  tasks: string[];
}

export interface PhaseWindowRule {
  type: "phaseWindow";
  task: string;
  allowedPhases: number[];
}

export interface LoadLimitRule {
  type: "loadLimit";
  workerGroup: string;
  maxSlotsPerPhase: number;
}

export interface SlotRestrictionRule {
  type: "slotRestriction";
  group: string;
  minCommonSlots: number;
}

export interface PatternMatchRule {
  type: "patternMatch";
  regex: string;
  ruleTemplate: string;
  parameters: Record<string, any>;
}

export interface PrecedenceRule {
  type: "precedence";
  global: string[];
  specific: Record<string, string[]>;
}

export type Rule =
  | CoRunRule
  | PhaseWindowRule
  | LoadLimitRule
  | SlotRestrictionRule
  | PatternMatchRule
  | PrecedenceRule;
