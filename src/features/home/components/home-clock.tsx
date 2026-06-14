"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function formatDateTime(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Lagos",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = parts.find((part) => part.type === "minute")?.value ?? "";
  const dayPeriod = hour >= 12 ? "PM" : "AM";

  return `${weekday.toUpperCase()}, ${String(hour).padStart(2, "0")}:${minute} ${dayPeriod} LAGOS`;
}

export default function HomeClock() {
  const [clock, setClock] = useState<{ label: string; iso: string } | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock({
        label: formatDateTime(now),
        iso: now.toISOString(),
      });
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="home-datetime-wrap">
      <Clock className="home-datetime-icon" aria-hidden="true" strokeWidth={2} />
      <time
        className="home-datetime"
        dateTime={clock?.iso}
        suppressHydrationWarning
      >
        {clock?.label ?? "\u00a0"}
      </time>
    </div>
  );
}
