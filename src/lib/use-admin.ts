"use client";

import * as React from "react";

type AdminState =
  | { status: "loading"; isAdmin: false }
  | { status: "ready"; isAdmin: boolean }
  | { status: "error"; isAdmin: false; message: string };

export function useAdmin() {
  const [state, setState] = React.useState<AdminState>({
    status: "loading",
    isAdmin: false,
  });

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/admin", { cache: "no-store" });
        if (!res.ok) throw new Error(`Admin check failed (${res.status})`);

        const payload = (await res.json().catch(() => null)) as { isAdmin?: unknown } | null;
        const isAdmin = typeof payload?.isAdmin === "boolean" ? payload.isAdmin : false;
        if (!cancelled) setState({ status: "ready", isAdmin });
      } catch (e) {
        if (!cancelled) {
          setState({
            status: "error",
            isAdmin: false,
            message: e instanceof Error ? e.message : "Admin check failed.",
          });
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

