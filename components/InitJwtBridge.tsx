// components/InitJwtBridge.tsx
"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

declare global {
  interface Window {
    Capacitor?: {
      Plugins?: {
        AuthBridge?: {
          saveJwt?: (opts: { jwt: string }) => Promise<void>;
        };
      };
    };
  }
}

export default function InitJwtBridge() {
  useEffect(() => {
    console.log("%c[InitJwtBridge] Mounted", "color: #4CAF50; font-weight: bold;");

    const run = async () => {
      try {
        console.log("[InitJwtBridge] Calling authClient.token()...");

        const { data, error } = await authClient.token();

        if (error) {
          console.error("[InitJwtBridge] Error fetching token:", error);
        }

        console.log("[InitJwtBridge] TOKEN RESPONSE:", data);

        if (!data?.token) {
          console.warn("[InitJwtBridge] No token received");
          return;
        }

        const jwt = data.token;
        console.log("%c[InitJwtBridge] JWT:", "color: #2196F3;", jwt);

        const saveJwt = window.Capacitor?.Plugins?.AuthBridge?.saveJwt;

        if (!saveJwt) {
          console.warn("[InitJwtBridge] saveJwt plugin not found on window.Capacitor.Plugins.AuthBridge");
          return;
        }

        console.log("[InitJwtBridge] Calling saveJwt()...");
        await saveJwt({ jwt });

        console.log("%c[InitJwtBridge] JWT successfully sent to native App", "color: #00C853; font-weight: bold;");
      } catch (err) {
        console.error("[InitJwtBridge] Unexpected error:", err);
      }
    };

    run();
  }, []);

  return null;
}
