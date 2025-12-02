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
    const run = async () => {
      const { data } = await authClient.token();
      if (!data?.token) return;

      const jwt = data.token;

      const saveJwt = window.Capacitor?.Plugins?.AuthBridge?.saveJwt;
      if (typeof saveJwt === "function") {
        await saveJwt({ jwt });
      }
    };

    run();
  }, []);

  return null;
}
