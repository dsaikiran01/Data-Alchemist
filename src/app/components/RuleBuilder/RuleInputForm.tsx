"use client";

import { useState } from "react";
import { TextField, MenuItem, Button, Box, Chip, Stack } from "@mui/material";
import { useRuleStore } from "@/store/useStore";
import { Rule, RuleType } from "@/types/rules";

// Dummy data for dropdowns — replace with actual props or context
const dummyTaskIds = ["T1", "T2", "T3"];
const dummyGroups = ["Sales", "Ops", "HR"];

import React from 'react';

interface RuleInputFormProps {
  taskIds: string[];
  groupTags: string[];
}

// export default function RuleInputForm() {

const RuleInputForm: React.FC<RuleInputFormProps> = ({ taskIds, groupTags }) => {
  const { addRule } = useRuleStore();
  const [ruleType, setRuleType] = useState<RuleType>("coRun");

  // Dynamic inputs
  const [tasks, setTasks] = useState<string[]>([]);
  const [task, setTask] = useState<string>("");
  const [phases, setPhases] = useState<number[]>([]);
  const [workerGroup, setWorkerGroup] = useState("");
  const [maxSlots, setMaxSlots] = useState<number>(1);

  const handleAddRule = () => {
    let rule: Rule;

    switch (ruleType) {
      case "coRun":
        rule = { type: "coRun", tasks };
        break;
      case "phaseWindow":
        rule = { type: "phaseWindow", task, allowedPhases: phases };
        break;
      case "loadLimit":
        rule = { type: "loadLimit", workerGroup, maxSlotsPerPhase: maxSlots };
        break;
      case "slotRestriction":
        rule = { type: "slotRestriction", group: workerGroup, minCommonSlots: maxSlots };
        break;
      default:
        alert("Rule type not yet implemented");
        return;
    }

    addRule(rule);
    resetInputs();
  };

  const resetInputs = () => {
    setTasks([]);
    setTask("");
    setPhases([]);
    setWorkerGroup("");
    setMaxSlots(1);
  };

  return (
    <Box p={2} border="1px solid #ddd" borderRadius={2} mt={2}>
      <TextField
        fullWidth
        select
        label="Rule Type"
        value={ruleType}
        onChange={(e) => setRuleType(e.target.value as RuleType)}
        sx={{ mb: 2 }}
      >
        <MenuItem value="coRun">Co-Run Tasks</MenuItem>
        <MenuItem value="phaseWindow">Phase Window</MenuItem>
        <MenuItem value="loadLimit">Load Limit</MenuItem>
        <MenuItem value="slotRestriction">Slot Restriction</MenuItem>
      </TextField>

      {/* Dynamic Inputs */}
      {ruleType === "coRun" && (
        <TextField
          select
          label="Select Tasks"
          // SelectProps={{ multiple: true }}
          slotProps={{
            select: {
              multiple: true,
            },
          }}
          fullWidth
          value={tasks}
          // onChange={(e) => setTasks(e.target.value as string[])}
          // onChange={(e) => setTasks([e.target.value])}
          onChange={(e) => setTasks(e.target.value.split(',').map((item) => item.trim()))}
          sx={{ mb: 2 }}
        >
          {dummyTaskIds.map((id) => (
            <MenuItem key={id} value={id}>
              {id}
            </MenuItem>
          ))}
        </TextField>
      )}

      {ruleType === "phaseWindow" && (
        <>
          <TextField
            select
            label="Task"
            fullWidth
            value={task}
            onChange={(e) => setTask(e.target.value)}
            sx={{ mb: 2 }}
          >
            {dummyTaskIds.map((id) => (
              <MenuItem key={id} value={id}>
                {id}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Allowed Phases (comma-separated)"
            fullWidth
            value={phases.join(",")}
            onChange={(e) =>
              setPhases(
                e.target.value
                  .split(",")
                  .map((s) => parseInt(s.trim()))
                  .filter((n) => !isNaN(n))
              )
            }
            sx={{ mb: 2 }}
          />
          <Stack direction="row" spacing={1} mb={2}>
            {phases.map((p) => (
              <Chip key={p} label={`Phase ${p}`} />
            ))}
          </Stack>
        </>
      )}

      {(ruleType === "loadLimit" || ruleType === "slotRestriction") && (
        <>
          <TextField
            select
            label="Group"
            fullWidth
            value={workerGroup}
            onChange={(e) => setWorkerGroup(e.target.value)}
            sx={{ mb: 2 }}
          >
            {dummyGroups.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={ruleType === "loadLimit" ? "Max Slots / Phase" : "Min Common Slots"}
            fullWidth
            type="number"
            value={maxSlots}
            onChange={(e) => setMaxSlots(parseInt(e.target.value))}
            sx={{ mb: 2 }}
          />
        </>
      )}

      <Button variant="contained" onClick={handleAddRule} disabled={ruleType === ""}>
        ➕ Add Rule
      </Button>
    </Box>
  );
}

export default RuleInputForm;
