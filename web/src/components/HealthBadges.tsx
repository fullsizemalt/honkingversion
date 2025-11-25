"use client";

import { useEffect, useState } from "react";

type Status = "checking" | "up" | "down";

const badgeClass = (status: Status) => {
  switch (status) {
    case "up":
      return "bg-[color:rgba(48,179,86,0.15)] text-[color:rgba(48,179,86,0.9)] border border-[color:rgba(48,179,86,0.35)]";
    case "down":
      return "bg-[color:rgba(220,53,69,0.12)] text-[color:rgba(220,53,69,0.9)] border border-[color:rgba(220,53,69,0.35)]";
    default:
      return "bg-[var(--bg-muted)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]";
  }
};

export default function HealthBadges() {
  const [apiStatus, setApiStatus] = useState<Status>("checking");
  const [dbStatus, setDbStatus] = useState<Status>("checking");

  useEffect(() => {
    const check = async () => {
      try {
        const apiRes = await fetch("/api/hv/healthz", { cache: "no-store" });
        setApiStatus(apiRes.ok ? "up" : "down");
      } catch {
        setApiStatus("down");
      }

      try {
        const dbRes = await fetch("/api/hv/performances/?limit=1", { cache: "no-store" });
        setDbStatus(dbRes.ok ? "up" : "down");
      } catch {
        setDbStatus("down");
      }
    };
    check();
  }, []);

  return (
    <div className="flex flex-wrap gap-2 text-[10px] font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-[0.25em]">
      <span className={`${badgeClass("up")} px-3 py-1`}>Web Up</span>
      <span className={`${badgeClass(apiStatus)} px-3 py-1`}>API {apiStatus === "checking" ? "..." : apiStatus}</span>
      <span className={`${badgeClass(dbStatus)} px-3 py-1`}>DB {dbStatus === "checking" ? "..." : dbStatus}</span>
    </div>
  );
}
