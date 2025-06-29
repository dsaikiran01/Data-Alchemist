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
    useGridApiRef,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

interface DataGridWrapperProps {
    title: string;
    rows: GridRowsProp;
    columns: GridColDef[];
    onRowsChange?: (rows: GridRowsProp) => void;
    highlighted: { id: number; field: string } | null;
}

interface DataGridWrapperRef {
    scrollToRow: (id: number) => void;
}

// function DataGridWrapper({ title, rows, columns, onRowsChange }: DataGridWrapperProps, ref: React.Ref<any>, highlighted?: { id: number; field: string }) {

const DataGridWrapper = forwardRef<DataGridWrapperRef, DataGridWrapperProps>(({
    title,
    rows,
    columns,
    onRowsChange,
    highlighted
}, ref) => {

    const [localRows, setLocalRows] = useState<GridRowsProp>(rows);

    const gridRef = useRef<any>(null);
    const apiRef = useGridApiRef(); // Using the apiRef for controlling the grid

    // Expose the scrollToRow function to the parent via ref
    useImperativeHandle(ref, () => ({
        scrollToRow: (id: number) => {
            const rowIndex = rows.findIndex(row => row.id === id);
            if (rowIndex !== -1) {
                // gridRef.current?.scrollToIndexes({ rowIndex });
                apiRef.current?.scrollToIndexes({ rowIndex }); // Using apiRef to scroll

            }
        },
    }));

    const handleRowEdit: GridEventListener<"rowEditStop"> = (_, event) => {
        const updatedRows = [...localRows];
        onRowsChange?.(updatedRows);
    };

    const handleAddRow = () => {
        const maxId = localRows.length
            ? Math.max(...localRows.map((r) => Number(r.id) || 0))
            : 0;

        const emptyRow: any = { id: maxId + 1 };
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
                    ref={gridRef}
                    apiRef={apiRef} // Pass the apiRef to the DataGrid for scrolling to error row
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
                    getRowId={(row) => row.id}
                    getCellClassName={(params) => {
                        if (
                            highlighted &&
                            highlighted.id === params.id &&
                            highlighted.field === params.field
                        ) {
                            console.log("Highlighting cell:", params);
                            return "blinking-error-cell";
                        }
                        return "";
                    }}
                />
            </Box>
        </Paper>
    );
});

// export default forwardRef(DataGridWrapper);
export default DataGridWrapper;
