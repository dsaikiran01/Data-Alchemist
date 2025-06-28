// src/app/components/layout/ThemeRegistry.tsx
"use client";

import { ReactNode } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: { main: "#5e60ce" },
    secondary: { main: "#f72585" },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
