"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registro opcional: si falla, la app sigue funcionando igual.
      });
    }
  }, []);
  return null;
}
