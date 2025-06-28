"use client";

import {
  Container,
  Typography,
  Divider,
  Box,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from "@mui/material";

import RuleInputForm from "@/components/RuleBuilder/RuleInputForm";
import RuleList from "@/components/RuleBuilder/RuleList";
import NaturalRuleInput from "@/components/RuleBuilder/NaturalRuleInput";
import RuleSuggestions from "@/components/RuleBuilder/RuleSuggestions";
import SliderWeights from "@/components/PrioritySettings/SliderWeights";
import ExportPanel from "@/components/ExportPanel";
import FileUploadPanel from "@/components/FileUploadPanel";
import Navbar from "@/components/layout/Navbar";

// Placeholder values for now
const dummyTaskIds = ["T1", "T2", "T3"];
const dummyGroups = ["Sales", "Tech", "Ops"];

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* HEADER */}
      <Typography variant="h4" gutterBottom>
        ⚙️ Data Alchemist — Configurator
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Upload your task, client, and worker data — then define smart rules,
        prioritize constraints, and export your allocation-ready config.
      </Typography>

      {/* STEP INDICATOR */}
      <Box mt={4}>
        <Stepper activeStep={1} alternativeLabel>
          {["Upload", "Rules", "Priorities", "Export"].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Divider sx={{ my: 5 }} />

      {/* RULE BUILDER */}
      <Typography variant="h5" gutterBottom>
        📜 Rule Engine
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <RuleInputForm taskIds={dummyTaskIds} groupTags={dummyGroups} />
          <NaturalRuleInput />
          <RuleSuggestions />
        </Grid>
        <Grid item xs={12} md={6}>
          <RuleList />
        </Grid>
      </Grid>

      <Divider sx={{ my: 6 }} />

      {/* PRIORITIZATION */}
      <Typography variant="h5" gutterBottom>
        🎚 Prioritization Settings
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <SliderWeights onChange={(weights) => console.log("Weights updated:", weights)} />
      </Paper>

      <Divider sx={{ my: 6 }} />

      {/* EXPORT */}
      <ExportPanel />

      <FileUploadPanel />

    </Container>
  );
}

