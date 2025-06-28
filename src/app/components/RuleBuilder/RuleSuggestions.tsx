"use client";

import { useState } from "react";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { useRuleStore } from "@/store/useStore";
import { analyzeDataAndSuggestRules } from "@/lib/analyzeDataAndSuggestRules";
import { Rule } from "@/types/rules";

// Replace with real props later
const dummyClients = [
  { ClientID: "C1", RequestedTaskIDs: "T1,T2" },
  { ClientID: "C2", RequestedTaskIDs: "T1,T2" },
  { ClientID: "C3", RequestedTaskIDs: "T1,T2" },
];
const dummyTasks: any[] = [];

export default function RuleSuggestions() {
  const [suggestions, setSuggestions] = useState<Rule[]>([]);
  const { addRule } = useRuleStore();

  const handleGenerate = () => {
    const rules = analyzeDataAndSuggestRules({
      clients: dummyClients,
      tasks: dummyTasks,
      workers: [],
    });
    setSuggestions(rules);
  };

  const handleAccept = (rule: Rule) => {
    addRule(rule);
    setSuggestions((prev) => prev.filter((r) => r !== rule));
  };

  return (
    <Paper sx={{ mt: 4, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        💡 AI Rule Suggestions
      </Typography>
      <Button onClick={handleGenerate} variant="outlined" sx={{ mb: 2 }}>
        Generate Suggestions
      </Button>

      {suggestions.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No suggestions yet.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {suggestions.map((rule, index) => (
            <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontFamily="monospace">{JSON.stringify(rule)}</Typography>
              <Button size="small" onClick={() => handleAccept(rule)} variant="contained">
                Accept
              </Button>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
