"use client";

import { useEffect } from "react";
import { SplashScreen } from "@capacitor/splash-screen";

export default function HideSplash() {
  useEffect(() => {
    // Delay ensures hydration + Next.js UI is ready
    const timer = setTimeout(() => {
      SplashScreen.hide({
        fadeOutDuration: 300,
      });
    }, 300); // You can change delay if needed

    return () => clearTimeout(timer);
  }, []);

  return null;
}
