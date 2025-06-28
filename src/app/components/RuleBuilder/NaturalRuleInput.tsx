"use client";

import { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { parseNaturalRule } from "@/lib/naturalRuleParser";
import { useRuleStore } from "@/store/useStore";

export default function NaturalRuleInput() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { addRule } = useRuleStore();

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");

    try {
      const rule = await parseNaturalRule(input);
      if (!rule) {
        setError("AI could not understand the rule format. Try rephrasing.");
        return;
      }

      addRule(rule);
      setInput("");
    } catch (err) {
      setError("Something went wrong while calling OpenAI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={4} p={2} border="1px dashed #ccc" borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        🤖 Natural Language Rule Input
      </Typography>
      <TextField
        fullWidth
        label="Type your rule here"
        placeholder='E.g., "Make T1 and T2 co-run in the same phase."'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        multiline
        rows={2}
        sx={{ my: 2 }}
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button variant="outlined" onClick={handleSubmit} disabled={loading}>
        {loading ? "Parsing..." : "Add via AI"}
      </Button>
    </Box>
  );
}
