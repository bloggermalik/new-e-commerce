"use client";

import React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProvider as MUIThemeProvider, CssBaseline, createTheme } from "@mui/material";

// Optional: customize MUI theme to match Tailwind colors
const muiTheme = createTheme({
  palette: {
    primary: { main: "#2563eb" }, // Tailwind blue-600
    secondary: { main: "#f59e0b" }, // Tailwind amber-500
  },
});

interface ClientMuiProviderProps {
  children: React.ReactNode;
}

export default function ClientMuiProvider({ children }: ClientMuiProviderProps) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MUIThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </NextThemeProvider>
  );
}
