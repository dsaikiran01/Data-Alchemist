"use client";

import { Button, Box, Typography, Stack } from "@mui/material";
import { useRuleStore } from "@/store/useStore";
import generateRulesJson from "@/lib/generateRulesJson";
import { saveAs } from "file-saver";

export default function ExportPanel() {
  const { rules } = useRuleStore();

  const handleDownload = () => {
    // for removing "id" column before exporting csv file
    // const exportWithoutId = rows.map(({ id, ...rest }) => rest);

    // Export rules.json
    const ruleBlob = new Blob([generateRulesJson.rules], {
      type: "application/json",
    });
    saveAs(ruleBlob, "rules.json");

    // Placeholder JSON for prioritization — replace with actual weights if needed
    const prioritization = {
      priority: 50,
      fairness: 30,
      speed: 20,
    };
    const priorityBlob = new Blob([JSON.stringify(prioritization, null, 2)], {
      type: "application/json",
    });
    saveAs(priorityBlob, "prioritization.json");

    // Example CSV exports — replace with actual CSV content
    const sampleCsv = `ID,Name\nT1,Task One\nT2,Task Two`;
    const csvBlob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" });
    saveAs(csvBlob, "tasks.csv");

    // Add more CSVs here as you wire up data ingestion grids
  };

  return (
    <Box mt={6}>
      <Typography variant="h6" gutterBottom>
        📤 Export Configuration
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Download your rules, prioritization weights, and cleaned CSVs.
      </Typography>

      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="contained" onClick={handleDownload}>
          Download All Files
        </Button>
      </Stack>
    </Box>
  );
}
