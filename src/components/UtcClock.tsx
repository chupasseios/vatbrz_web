"use client";
import { useEffect, useState } from "react";
export default function UtcClock() {
  const [clock, setClock] = useState("--:--");
  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 16));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="utc-clock">
      {clock}
      <span> UTC</span>
    </span>
  );
}
