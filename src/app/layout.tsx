// src/app/layout.tsx

import "@/globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import ThemeRegistry from "@/components/layout/ThemeRegistry";


// Optional: Customize your theme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#5e60ce", // Purple shade
//     },
//     secondary: {
//       main: "#f72585", // Pinkish
//     },
//   },
//   typography: {
//     fontFamily: '"Inter", sans-serif',
//   },
// });

export const metadata = {
  title: "Data Alchemist",
  description: "AI-powered data configurator for scheduling & validation",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Navbar />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
