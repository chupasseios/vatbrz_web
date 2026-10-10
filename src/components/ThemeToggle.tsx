"use client";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { t } from "@/lib/portal";
export default function ThemeToggle({ lang = "pt-br" }: { lang?: string }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      setDark(document.documentElement.dataset.theme === "dark"),
    );
    return () => cancelAnimationFrame(frame);
  }, []);
  const toggle = () => {
    const next = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("vatbrz-theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  };
  return (
    <button
      type="button"
      className="icon-button"
      onClick={toggle}
      aria-label={t(
        lang,
        dark ? "Ativar tema claro" : "Ativar tema escuro",
        dark ? "Use light theme" : "Use dark theme",
      )}
    >
      <Icon name={dark ? "sun" : "moon"} size={18} />
    </button>
  );
}
