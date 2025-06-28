"use client";

import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function Navbar() {
  return (
    <AppBar position="sticky" color="primary"  elevation={2} sx={{ zIndex: 1300 }} enableColorOnDark>
      <Toolbar>
        <AutoAwesomeIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" fontWeight={600}>
          Data Alchemist
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
