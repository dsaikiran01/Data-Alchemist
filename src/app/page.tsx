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
  Grid,
  Paper,
  Divider,
} from "@mui/material";

// src/app/page.tsx

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

import FileUploadPanel from "@/components/FileUploadPanel";
import RuleInputForm from "@/components/RuleBuilder/RuleInputForm";
import RuleList from "@/components/RuleBuilder/RuleList";
import NaturalRuleInput from "@/components/RuleBuilder/NaturalRuleInput";
import RuleSuggestions from "@/components/RuleBuilder/RuleSuggestions";
import SliderWeights from "@/components/PrioritySettings/SliderWeights";
import ExportPanel from "@/components/ExportPanel";

// Placeholder data
// const dummyTaskIds = ["T1", "T2", "T3"];
// const dummyGroups = ["Sales", "Tech", "Ops"];

const steps = ["Upload", "Rules", "Prioritize", "Export"];

export default function CollapsibleStepperPage() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const isOpen = (index: number) => index <= activeStep;

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
          <FileUploadPanel />
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
            <SliderWeights onChange={(w) => console.log("weights", w)} />
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
          <ExportPanel />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}

