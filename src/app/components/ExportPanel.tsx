"use client";

import { Button, Stack, Typography } from "@mui/material";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { assignTasks } from "@/lib/taskAllocator";

export default function ExportPanel({
  clients,
  workers,
  tasks,
  rules,
  weights,
  disabled,
}: {
  clients: any[];
  workers: any[];
  tasks: any[];
  rules: any[];
  weights: { fairness: number; speed: number; loadBalance: number };
  disabled?: boolean;
}) {
  const toCsv = (data: any[]) => {
    const headers = Object.keys(data[0] || {}).filter((h) => h !== "id");
    const rows = data.map((row) =>
      headers.map((h) => `"${row[h] ?? ""}"`).join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  };

  const handleExport = async () => {
    const zip = new JSZip();

    const enhancedTasks = assignTasks(tasks, workers, rules, weights);

    // Add JSON files
    zip.file("tasks.json", JSON.stringify(enhancedTasks, null, 2));
    zip.file("rules.json", JSON.stringify(rules, null, 2));
    zip.file(
      "prioritization.json",
      JSON.stringify(
        {
          weights,
          explanation:
            "Higher scores = better matches based on skills, phases, and load.",
        },
        null,
        2
      )
    );

    // Add CSV files
    zip.file("clients.csv", toCsv(clients));
    zip.file("workers.csv", toCsv(workers));
    zip.file("tasks.csv", toCsv(tasks));

    // Generate and download zip
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\..+/, ""); // YYYYMMDDTHHmmss
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `data-alchemist-export-${timestamp}.zip`);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Download all configured data as a single zipped export.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleExport}
        disabled={disabled}
      >
        Export All Files (ZIP)
      </Button>
    </Stack>
  );
}
