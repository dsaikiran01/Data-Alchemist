"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
  AccordionProps,
  // Grid,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import Grid from '@mui/material/Grid';

import { useState, useEffect, useRef } from "react";
import { useRuleStore } from "@/store/useStore";

import DataGridWrapper from "@/components/DataGridWrapper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileUploadPanel from "@/components/FileUploadPanel";
import RuleInputForm from "@/components/RuleBuilder/RuleInputForm";
import RuleList from "@/components/RuleBuilder/RuleList";
import NaturalRuleInput from "@/components/RuleBuilder/NaturalRuleInput";
import RuleSuggestions from "@/components/RuleBuilder/RuleSuggestions";
import SliderWeights from "@/components/PrioritySettings/SliderWeights";
import ExportPanel from "@/components/ExportPanel";

import { ZodSchema } from "zod";
import { clientSchema, taskSchema, workerSchema } from "@/lib/validateData";
import { GridValidRowModel } from "@mui/x-data-grid/models";

const steps = ["Upload", "Rules", "Prioritize", "Export"];

// Generalized helper
const makeValidatedColumns = (rows: any[], schema: ZodSchema): any[] => {
  if (!rows.length) return [];

  return Object.keys(rows[0])
    .filter((key) => key !== "id")
    .map((key) => ({
      field: key,
      headerName: key,
      flex: 1,
      editable: true,
      preProcessEditCellProps: (params: any) => {
        const updatedRow = { ...params.row, [key]: params.props.value };
        const result = schema.safeParse(updatedRow);

        const errorMessage = result.success
          ? ""
          : result.error.issues.find((i) => i.path[0] === key)?.message;

        return {
          ...params.props,
          error: !!errorMessage,
          // helperText: errorMessage,
        };
      },
    }));
};

// for validation summary
const getValidationErrors = (rows: any[], schema: ZodSchema) => {
  return rows.map((row, index) => {
    const result = schema.safeParse(row);
    return result.success
      ? null
      : {
        index,
        issues: result.error.issues.map((i) => ({
          field: i.path[0],
          message: i.message,
        })),
      };
  }).filter(Boolean);
};

export default function CollapsibleStepperPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [weights, setWeights] = useState({ priority: 50, fairness: 30, speed: 20 });

  // for storing data fromm .csv files
  const [clients, setClients] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  // const [highlighted, setHighlighted] = useState<{ id: number; field: string } | null>(null);
  const [highlightedClient, setHighlightedClient] = useState<{ id: number; field: string } | null>(null);
  const [highlightedWorker, setHighlightedWorker] = useState<{ id: number; field: string } | null>(null);
  const [highlightedTask, setHighlightedTask] = useState<{ id: number; field: string } | null>(null);


  const clientColumns = makeValidatedColumns(clients, clientSchema);
  const workerColumns = makeValidatedColumns(workers, workerSchema);
  const taskColumns = makeValidatedColumns(tasks, taskSchema);

  const clientErrors = getValidationErrors(clients, clientSchema);
  const workerErrors = getValidationErrors(workers, workerSchema);
  const taskErrors = getValidationErrors(tasks, taskSchema);

  const hasExportErrors =
    clientErrors.length > 0 ||
    workerErrors.length > 0 ||
    taskErrors.length > 0;

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const rules = useRuleStore((s) => s.rules);

  const isOpen = (index: number) => index <= activeStep;

  // from step-2 to step-3
  useEffect(() => {
    if (activeStep === 1 && rules.length > 0) {
      setActiveStep(2);
    }
  }, [rules]);

  // from step-3 to step-4
  useEffect(() => {
    if (activeStep === 2 && Object.values(weights).some((w) => w !== 0)) {
      setActiveStep(3);
    }
  }, [weights]);

  const clientGridRef = useRef<any>(null);
  const workerGridRef = useRef<any>(null);
  const taskGridRef = useRef<any>(null);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Data Alchemist — Configurator
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Upload your data, define rules, prioritize constraints, and export configuration.
      </Typography>

      {/* 🧭 PROGRESS BAR */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 4, mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* 📥 Step 1: Upload */}
      <Accordion expanded={isOpen(0)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">📥 Upload CSV Files</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FileUploadPanel
            onCompleteUpload={() => setActiveStep(1)}
            onDataParsed={({ clients = [], workers = [], tasks = [] }) => {
              console.log("Parsed:", { clients, workers, tasks });
              setClients(clients.map((c, i) => ({ ...c, id: i })));
              setWorkers(workers.map((w, i) => ({ ...w, id: i })));
              setTasks(tasks.map((t, i) => ({ ...t, id: i })));
            }}
          />

          {/* for rendering the rows when files are uploaded */}

          {/* Client errors */}
          {clientErrors.length > 0 && (
            <>
              <Alert severity="error" sx={{ mb: 2 }}>
                Clients have {clientErrors.length} invalid row(s). Please fix before continuing.
              </Alert>
              <Button
                variant="outlined"
                onClick={() => {
                  const error = getValidationErrors(clients, clientSchema)[0];
                  if (error) {
                    // clientGridRef.current?.scrollToRow(error.index);

                    const field = error.issues[0].field;
                    const rowIndex = error.index;
                    setHighlightedClient({
                      id: rowIndex,
                      field: typeof field === 'string' ? field : String(field)
                    });
                    clientGridRef.current?.scrollToRow(rowIndex);

                    // Remove highlight after 1.5s
                    setTimeout(() => setHighlightedClient(null), 1500);
                  }
                }}
              >
                Jump to First Client Error
              </Button>
            </>
          )}

          {/* Clients DataGrid */}
          {clients.length > 0 && (
            <DataGridWrapper
              ref={clientGridRef}
              title="Clients"
              rows={clients}
              columns={clientColumns}
              // onRowsChange={setClients}
              onRowsChange={(rows: readonly GridValidRowModel[]) => setClients([...rows])} // Spread to create a mutable array
              highlighted={highlightedClient}
            />
          )}

          {/* Worker errors */}
          {workerErrors.length > 0 && (
            <>
              <Alert severity="error" sx={{ mb: 2 }}>
                Workers have {workerErrors.length} invalid row(s). Please fix before continuing.
              </Alert>
              <Button
                variant="outlined"
                onClick={() => {
                  const error = getValidationErrors(workers, workerSchema)[0];
                  if (error) {
                    // workerGridRef.current?.scrollToRow(error.index);

                    const field = error.issues[0].field;
                    const rowIndex = error.index;
                    workerGridRef.current?.scrollToRow(rowIndex);
                     requestAnimationFrame(() => {
                    console.log("Setting worker highlight:", { id: rowIndex, field });

                      setHighlightedWorker({
                      id: rowIndex,
                      field: typeof field === 'string' ? field : String(field)
                    });

                    console.log("Setting worker highlight:", { id: rowIndex, field });

                    // Remove highlight after 1.5s
                    setTimeout(() => setHighlightedWorker(null), 1500);
                  })}
                }}
              >
                Jump to First Worker Error
              </Button>
            </>
          )}

          {/* Workers DataGrid */}
          {workers.length > 0 && (
            <DataGridWrapper
              ref={workerGridRef}
              title="Workers"
              rows={workers}
              columns={workerColumns}
              // onRowsChange={setWorkers}
              onRowsChange={(rows: readonly GridValidRowModel[]) => setWorkers([...rows])} // Spread to create a mutable array
              highlighted={highlightedWorker}
            />
          )}

          {/* Task errors */}
          {taskErrors.length > 0 && (
            <>
              <Alert severity="error" sx={{ mb: 2 }}>
                Tasks have {taskErrors.length} invalid row(s). Please fix before continuing.
              </Alert>
              <Button
                variant="outlined"
                onClick={() => {
                  const error = getValidationErrors(tasks, taskSchema)[0];
                  if (error) {
                    // taskGridRef.current?.scrollToRow(error.index);

                    const field = error.issues[0].field;
                    const rowIndex = error.index;
                    setHighlightedTask({
                      id: rowIndex,
                      field: typeof field === 'string' ? field : String(field)
                    });
                    taskGridRef.current?.scrollToRow(rowIndex);

                    // Remove highlight after 1.5s
                    setTimeout(() => setHighlightedTask(null), 1500);
                  }
                }}
              >
                Jump to First Task Error
              </Button>
            </>
          )}

          {/* Tasks DataGrid */}
          {tasks.length > 0 && (
            <DataGridWrapper
              ref={taskGridRef}
              title="Tasks"
              rows={tasks}
              columns={taskColumns}
              // onRowsChange={setTasks}
              onRowsChange={(rows: readonly GridValidRowModel[]) => setTasks([...rows])} // Spread to create a mutable array
              highlighted={highlightedTask}
            />
          )}

          <Box textAlign="right">
            <Button variant="contained" onClick={handleNext}>
              Continue to Rules
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* 📜 Step 2: Rule Builder */}
      <Accordion expanded={isOpen(1)} disabled={!isOpen(1)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">📜 Build Allocation Rules</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <RuleInputForm taskIds={["T1", "T2", "T3"]} groupTags={["Ops", "Tech"]} />
              <NaturalRuleInput />
              <RuleSuggestions />
            </Grid>
            <Grid item xs={12} md={6}>
              <RuleList />
            </Grid>
          </Grid>
          <Box textAlign="right" mt={2}>
            <Button variant="contained" onClick={handleNext}>
              Continue to Prioritization
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* 🎚 Step 3: Prioritization */}
      <Accordion expanded={isOpen(2)} disabled={!isOpen(2)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">🎚 Set Prioritization Weights</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper sx={{ p: 3 }}>
            {/* <SliderWeights onChange={(w) => console.log("weights", w)} /> */}
            <SliderWeights onChange={(w) => setWeights(w)} />
          </Paper>
          <Box textAlign="right" mt={2}>
            <Button variant="contained" onClick={handleNext}>
              Continue to Export
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* 📦 Step 4: Export */}
      <Accordion expanded={isOpen(3)} disabled={!isOpen(3)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">📦 Export Final Config</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ExportPanel
            clients={clients}
            workers={workers}
            tasks={tasks}
            disabled={hasExportErrors}
          />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}

