// src/context/SystemStatusContext.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";

type SystemStatus = "online" | "syncing" | "warning" | "offline";

interface Event {
  type: "payment" | "late" | "newTenant";
  message: string;
  date: Date;
}

interface SystemContextType {
  status: SystemStatus;
  events: Event[];
}

const SystemStatusContext = createContext<SystemContextType | null>(null);

export function SystemStatusProvider({ children }: any) {
  const [status, setStatus] = useState<SystemStatus>("online");
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();

      if (rand < 0.6) {
        setStatus("online");
        setEvents((prev) => [
          {
            type: "payment",
            message: "Pagamento recebido",
            date: new Date(),
          },
          ...prev,
        ]);
      } else if (rand < 0.8) {
        setStatus("syncing");
      } else if (rand < 0.95) {
        setStatus("warning");
        setEvents((prev) => [
          {
            type: "late",
            message: "Inquilino atrasado",
            date: new Date(),
          },
          ...prev,
        ]);
      } else {
        setStatus("offline");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SystemStatusContext.Provider value={{ status, events }}>
      {children}
    </SystemStatusContext.Provider>
  );
}

export const useSystemStatus = () => {
  const ctx = useContext(SystemStatusContext);
  if (!ctx) throw new Error("useSystemStatus fora do provider");
  return ctx;
};