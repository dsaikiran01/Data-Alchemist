"use client";

import { AppBar, Toolbar, Typography, Box, Button, Stack } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useEffect, useState } from "react";

const SECTIONS = ["upload", "rules", "priorities", "export"] as const;

export default function Navbar() {
  const [active, setActive] = useState<string>("upload");

  // 🧠 Detect which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActive(visible.target.id);
        }
      },
      { rootMargin: "-50% 0px -40% 0px", threshold: 0.1 }
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // const scrollTo = (id: string) => {
  //   const el = document.getElementById(id);
  //   if (el) {
  //     el.scrollIntoView({ behavior: "smooth", block: "start" });
  //   }
  // };

  return (
    <AppBar position="sticky" elevation={2} sx={{ zIndex: 1300 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <AutoAwesomeIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Data Alchemist
          </Typography>
        </Box>

        {/* <Stack direction="row" spacing={2}>
          {SECTIONS.map((sec) => (
            <Button
              key={sec}
              onClick={() => scrollTo(sec)}
              color={active === sec ? "secondary" : "inherit"}
              sx={{
                textTransform: "capitalize",
                fontWeight: active === sec ? 700 : 400,
              }}
            >
              {sec}
            </Button>
          ))}
        </Stack> */}
      </Toolbar>
    </AppBar>
  );
}
