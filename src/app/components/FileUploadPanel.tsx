// src/app/components/FileUploadPanel.tsx

"use client";

import { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import Papa from "papaparse";
import * as XLSX from "xlsx";

type UploadType = "clients" | "workers" | "tasks";

export default function FileUploadPanel({
  onCompleteUpload,
  onDataParsed,
}: {
  onCompleteUpload?: () => void;
  onDataParsed?: (data: {
    clients: any[];
    workers: any[];
    tasks: any[];
  }) => void;
}) {
  const [uploadedFiles, setUploadedFiles] = useState({
    clients: null,
    workers: null,
    tasks: null,
  });

  useEffect(() => {
    const hasAny = Object.values(uploadedFiles).some((f) => f && f.data.length > 0);
    if (hasAny) {
      onDataParsed?.({
        clients: uploadedFiles.clients?.data ?? [],
        workers: uploadedFiles.workers?.data ?? [],
        tasks: uploadedFiles.tasks?.data ?? [],
      });

      const allUploaded = Object.values(uploadedFiles).every((f) => f && f.data.length > 0);
      if (allUploaded) {
        onCompleteUpload?.();
      }
    }
  }, [uploadedFiles]);


  const handleFileUpload = (type: UploadType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    const parseAndSet = (parsed: any[]) => {
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: {
          name: file.name,
          data: parsed,
          columns: parsed.length > 0 ? Object.keys(parsed[0]) : [],
        },
      }));
    };

    if (fileName.endsWith(".csv")) {
      // ✅ Parse CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => parseAndSet(result.data),
      });
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      // ✅ Parse Excel
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsed = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
        parseAndSet(parsed);
      };
      // reader.readAsBinaryString(file) is deprecated
      reader.readAsArrayBuffer(file);
    } else {
      alert("Unsupported file type. Please upload .csv or .xlsx/.xls");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* <Typography variant="h6" gutterBottom>
        📥 Upload CSV Files
      </Typography> */}
      <Stack spacing={2} direction="column" flexWrap="wrap">
        {(["clients", "workers", "tasks"] as UploadType[]).map((type) => (
          <Box key={type}>
            <Button variant="outlined" component="label">
              Upload {type}.csv
              <input type="file" accept=".csv,.xlsx,.xls" hidden onChange={handleFileUpload(type)} />
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
