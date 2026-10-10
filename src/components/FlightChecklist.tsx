"use client";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { t } from "@/lib/portal";
export default function FlightChecklist({
  lang,
  atc = false,
}: {
  lang: string;
  atc?: boolean;
}) {
  const items = atc
    ? [
        t(
          lang,
          "Revisar o manual da posição e procedimentos locais",
          "Review the position manual and local procedures",
        ),
        t(
          lang,
          "Conferir as condições meteorológicas e pistas em uso",
          "Check weather conditions and runways in use",
        ),
        t(
          lang,
          "Preparar o cliente de radar e testar o áudio",
          "Prepare the radar client and test audio",
        ),
        t(
          lang,
          "Coordenar a abertura com os setores adjacentes",
          "Coordinate opening with adjacent sectors",
        ),
      ]
    : [
        t(
          lang,
          "Conferir meteorologia, cartas e NOTAM",
          "Check weather, charts and NOTAMs",
        ),
        t(
          lang,
          "Planejar rota, combustível e aeródromo alternativo",
          "Plan route, fuel and alternate aerodrome",
        ),
        t(
          lang,
          "Enviar o plano de voo na VATSIM",
          "File your VATSIM flight plan",
        ),
        t(
          lang,
          "Testar o áudio e conectar em uma posição de estacionamento",
          "Test audio and connect at a parking position",
        ),
      ];
  const storageKey = atc ? "vatbrz-checklist-atc" : "vatbrz-checklist-pilot";
  const [checked, setChecked] = useState<number[]>([]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const value: unknown = JSON.parse(
          sessionStorage.getItem(storageKey) || "[]",
        );
        if (Array.isArray(value))
          setChecked(
            value.filter(
              (n): n is number => Number.isInteger(n) && n >= 0 && n < 4,
            ),
          );
      } catch {}
    });
    return () => cancelAnimationFrame(frame);
  }, [storageKey]);
  const update = (next: number[]) => {
    setChecked(next);
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  };
  return (
    <section className="checklist panel">
      <div className="card-top">
        <span className="eyebrow">{t(lang, "PREPARAÇÃO", "PREPARATION")}</span>
        <span className="mono">
          {checked.length} / {items.length}
        </span>
      </div>
      <h2>
        {t(
          lang,
          atc ? "Antes de abrir a frequência." : "Antes de conectar.",
          atc ? "Before opening your frequency." : "Before connecting.",
        )}
      </h2>
      <p className="muted">
        {t(
          lang,
          "Uma ajuda para organizar sua sessão de simulação.",
          "A little help to organise your simulation session.",
        )}
      </p>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={t(lang, "Preparação concluída", "Preparation completed")}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={checked.length}
      >
        <span style={{ width: (checked.length / items.length) * 100 + "%" }} />
      </div>
      <div className="checklist-items">
        {items.map((item, index) => (
          <label key={index}>
            <input
              type="checkbox"
              checked={checked.includes(index)}
              onChange={() =>
                update(
                  checked.includes(index)
                    ? checked.filter((i) => i !== index)
                    : [...checked, index],
                )
              }
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
      <div className="checklist-footer">
        <span role="status">
          {checked.length === items.length
            ? t(
                lang,
                "Preparação concluída. Boa sessão!",
                "Ready. Enjoy your session!",
              )
            : t(
                lang,
                "Progresso salvo nesta aba.",
                "Progress saved in this tab.",
              )}
        </span>
        <button
          type="button"
          className="text-button"
          onClick={() => update([])}
        >
          <Icon name="refresh" size={14} />
          {t(lang, "Reiniciar", "Reset")}
        </button>
      </div>
    </section>
  );
}
