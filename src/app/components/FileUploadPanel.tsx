"use client";

import { useState } from "react";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import Papa from "papaparse";

type UploadType = "clients" | "workers" | "tasks";

interface UploadedFile {
  name: string;
  data: any[];
  columns: string[];
}

export default function FileUploadPanel() {
  const [uploadedFiles, setUploadedFiles] = useState<Record<UploadType, UploadedFile | null>>({
    clients: null,
    workers: null,
    tasks: null,
  });

  const handleFileUpload = (type: UploadType) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setUploadedFiles((prev) => ({
          ...prev,
          [type]: {
            name: file.name,
            data: result.data,
            columns: result.meta.fields || [],
          },
        }));
      },
    });
  };

  return (
    <Paper sx={{ p: 3, mb: 5 }}>
      <Typography variant="h6" gutterBottom>
        📥 Upload Your CSV Files
      </Typography>

      <Stack spacing={3} direction="row" flexWrap="wrap" mt={2}>
        {(["clients", "workers", "tasks"] as UploadType[]).map((type) => (
          <Box key={type}>
            <Button variant="outlined" component="label">
              Upload {type}.csv
              <input type="file" accept=".csv" hidden onChange={handleFileUpload(type)} />
            </Button>
            {uploadedFiles[type] && (
              <Typography mt={1} fontSize="0.875rem" color="text.secondary">
                ✅ {uploadedFiles[type]!.name} — {uploadedFiles[type]!.data.length} rows
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
