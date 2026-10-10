"use client";
import { useState } from "react";
import { t } from "@/lib/portal";
const colors = [
  ["Azul institucional", "Brand navy", "#050A2D"],
  ["Azul primário", "Primary blue", "#010EDB"],
  ["Azul de apoio", "Supporting blue", "#0054DB"],
  ["Verde", "Green", "#0DDB6E"],
  ["Amarelo", "Yellow", "#FEDF00"],
];
export default function BrandPalette({ lang }: { lang: string }) {
  const [copied, setCopied] = useState("");
  const [error, setError] = useState(false);
  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setError(false);
    } catch {
      setError(true);
    }
  };
  return (
    <>
      <div className="palette-grid">
        {colors.map(([pt, en, hex]) => (
          <article className="color-card panel" key={hex}>
            <div className="color-swatch" style={{ background: hex }} />
            <div className="color-info">
              <h3>{t(lang, pt, en)}</h3>
              <button
                type="button"
                onClick={() => copy(hex)}
                aria-label={t(lang, "Copiar cor ", "Copy colour ") + hex}
              >
                {copied === hex
                  ? t(lang, "Copiado ✓", "Copied ✓")
                  : hex + " ↗"}
              </button>
            </div>
          </article>
        ))}
      </div>
      <p
        role="status"
        className="small muted"
        style={{ minHeight: 24, marginTop: 10 }}
      >
        {error
          ? t(
              lang,
              "Não foi possível copiar. Selecione o código da cor manualmente.",
              "Could not copy. Select the colour code manually.",
            )
          : copied
            ? t(lang, "Cor copiada: ", "Colour copied: ") + copied
            : ""}
      </p>
    </>
  );
}
