"use client";

// Live local clock for the footer meta row: the current time where the
// author is (Las Cruces · America/Denver). Renders nothing until mounted so
// the statically exported HTML never ships a stale build-time timestamp;
// after hydration it ticks twice a minute.

import { useEffect, useState } from "react";

function mountainTime(): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Denver",
    timeZoneName: "short",
  }).format(new Date());
}

export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(mountainTime());
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  if (time === null) return null;
  return <span className="tabular-nums"> · {time}</span>;
}
