// src/app/components/FileUploadPanel.tsx

"use client";

import { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import Papa from "papaparse";

type UploadType = "clients" | "workers" | "tasks";

interface UploadedFile {
  name: string;
  data: any[];
  columns: string[];
}

export default function FileUploadPanel({
  onCompleteUpload,
}: {
  onCompleteUpload?: () => void;
}) {
  const [uploadedFiles, setUploadedFiles] = useState<Record<UploadType, UploadedFile | null>>({
    clients: null,
    workers: null,
    tasks: null,
  });

  // ✅ Check if all files uploaded
  useEffect(() => {
    const allUploaded = Object.values(uploadedFiles).every((f) => f && f.data.length > 0);
    if (allUploaded && onCompleteUpload) {
      onCompleteUpload(); // 🔔 Notify parent
    }
  }, [uploadedFiles]);

  const handleFileUpload = (type: UploadType) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        📥 Upload CSV Files
      </Typography>
      <Stack spacing={2} direction="row" flexWrap="wrap">
        {(["clients", "workers", "tasks"] as UploadType[]).map((type) => (
          <Box key={type}>
            <Button variant="outlined" component="label">
              Upload {type}.csv
              <input type="file" accept=".csv" hidden onChange={handleFileUpload(type)} />
            </Button>
            {uploadedFiles[type] && (
              <Typography fontSize="0.85rem" color="text.secondary" mt={0.5}>
                ✅ {uploadedFiles[type]!.name} ({uploadedFiles[type]!.data.length} rows)
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
