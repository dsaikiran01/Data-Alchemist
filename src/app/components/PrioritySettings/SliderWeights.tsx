"use client";

import { useState } from "react";
import { Box, Typography, Slider, Stack, Paper } from "@mui/material";

type WeightKeys = "priority" | "fairness" | "speed";

export interface WeightValues {
  priority: number;
  fairness: number;
  speed: number;
}

export default function SliderWeights({
  onChange,
}: {
  onChange?: (weights: WeightValues) => void;
}) {
  const [weights, setWeights] = useState<WeightValues>({
    priority: 50,
    fairness: 30,
    speed: 20,
  });

  const handleSliderChange = (key: WeightKeys) => (_: Event, value: number) => {
    const newWeights = { ...weights, [key]: value };
    setWeights(newWeights);
    onChange?.(newWeights);
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        🎛 Prioritization Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Adjust weights to indicate what the allocator should prioritize.
      </Typography>

      <Stack spacing={4} mt={2}>
        {Object.entries(weights).map(([key, value]) => (
          <Box key={key}>
            <Typography gutterBottom textTransform="capitalize">
              {key} ({value}%)
            </Typography>
            <Slider
              value={value}
              onChange={handleSliderChange(key as WeightKeys)}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
            />
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
