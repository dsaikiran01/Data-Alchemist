// src/app/components/DataGridWrapper.tsx
"use client";

import {
    Box,
    Typography,
    Paper,
    Button,
    Stack,
    IconButton,
} from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridRowsProp,
    GridEventListener,
    GridRowId,
    GridActionsCellItem,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

interface Props {
    title: string;
    rows: GridRowsProp;
    columns: GridColDef[];
    onRowsChange?: (rows: GridRowsProp) => void;
}

export default function DataGridWrapper({ title, rows, columns, onRowsChange }: Props) {
    const [localRows, setLocalRows] = useState<GridRowsProp>(rows);

    const handleRowEdit: GridEventListener<"rowEditStop"> = (_, event) => {
        const updatedRows = [...localRows];
        onRowsChange?.(updatedRows);
    };

    const handleAddRow = () => {
        const emptyRow: any = { id: Date.now() };
        columns.forEach((col) => {
            if (col.field !== "id") emptyRow[col.field] = "";
        });

        const newRows = [...localRows, emptyRow];
        setLocalRows(newRows);
        onRowsChange?.(newRows);
    };

    const handleDeleteRow = (id: GridRowId) => () => {
        const newRows = localRows.filter((r) => r.id !== id);
        setLocalRows(newRows);
        onRowsChange?.(newRows);
    };

    // Inject delete column into end of the table
    const withDeleteColumn: GridColDef[] = [
        ...columns,
        {
            field: "__actions",
            headerName: "",
            type: "actions",
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    key="delete"
                    icon={<DeleteIcon color="error" />}
                    label="Delete"
                    onClick={handleDeleteRow(params.id)}
                />,
            ],
        },
    ];

    return (
        <Paper sx={{ p: 3, mb: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6">{title}</Typography>
                <Button startIcon={<AddIcon />} onClick={handleAddRow} variant="outlined">
                    Add Row
                </Button>
            </Stack>

            <Box sx={{
                height: 400,
                '& .MuiDataGrid-columnSeparator': {
                    display: 'block', // ensure separators are visible
                    color: 'rgba(0, 0, 0, 0.1)', // light color
                    width: '1px', // thin line
                },
                '& .MuiDataGrid-cell': {
                    borderRight: '1px solid rgba(0, 0, 0, 0.1)', // optional: light cell border
                },
                '& .MuiDataGrid-columnHeaders': {
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)', // optional: header separator
                },
            }}>
                <DataGrid
                    rows={localRows}
                    columns={withDeleteColumn}
                    processRowUpdate={(updatedRow) => {
                        const updated = localRows.map((row) =>
                            row.id === updatedRow.id ? updatedRow : row
                        );
                        setLocalRows(updated);
                        onRowsChange?.(updated);
                        return updatedRow;
                    }}
                    experimentalFeatures={{ newEditingApi: true }}
                    pageSize={5}
                />
            </Box>
        </Paper>
    );
}
