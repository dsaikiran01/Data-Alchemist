"use client";

import { useRuleStore } from "@/store/useStore";
import { Box, List, ListItem, IconButton, Typography, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Rule } from "@/types/rules";

export default function RuleList() {
  const { rules, deleteRule } = useRuleStore();

  if (rules.length === 0) {
    return (
      <Typography mt={4} variant="body1" color="text.secondary">
        No rules added yet.
      </Typography>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        🗂 Current Rules
      </Typography>
      <List sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
        {rules.map((rule: Rule, index: number) => (
          <div key={index}>
            <ListItem
              secondaryAction={
                <IconButton edge="end" onClick={() => deleteRule(index)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <code style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {JSON.stringify(rule, null, 2)}
              </code>
            </ListItem>
            {index < rules.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </Box>
  );
}
