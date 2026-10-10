"use client";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { ActionLink } from "./PortalUI";
import { links, t } from "@/lib/portal";
interface Stats {
  pilotCount: number;
  atcCount: number;
  updatedAt: string;
  controllers: { callsign: string; frequency: string; name: string }[];
}
export default function NetworkPanel({ lang }: { lang: string }) {
  const [data, setData] = useState<Stats | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const abort = new AbortController();
    const get = async () => {
      try {
        const response = await fetch("/api/live-stats", {
          signal: abort.signal,
        });
        if (!response.ok) throw new Error("Network data unavailable");
        const next: Stats = await response.json();
        if (
          typeof next.pilotCount !== "number" ||
          !Array.isArray(next.controllers)
        )
          throw new Error("Invalid data");
        setData(next);
        setStatus("ready");
      } catch {
        if (!abort.signal.aborted) setStatus("error");
      }
    };
    get();
    const timer = setInterval(get, 60000);
    return () => {
      clearInterval(timer);
      abort.abort();
    };
  }, [attempt]);
  return (
    <section className="network-panel" aria-labelledby="network-title">
      <div className="network-map" aria-hidden="true">
        <div className="map-cross map-cross-a">+</div>
        <div className="map-cross map-cross-b">+</div>
        <span className="map-coordinate">
          05° N<br />
          34° W
        </span>
        <div className="brazil-map" />
        <div className="map-label">
          BRASIL<span>VATSIM AIRSPACE</span>
        </div>
        <div className="map-scale">
          <span />
          500 NM
        </div>
      </div>
      <div className="network-content">
        <span className="eyebrow light">
          <span
            className={"status-dot " + (status === "ready" ? "" : "status-off")}
          />
          {t(lang, "ESPAÇO AÉREO BRASILEIRO", "BRAZILIAN AIRSPACE")}
        </span>
        <h2 id="network-title">
          {t(lang, "Tem gente no seu céu.", "You share these skies.")}
        </h2>
        <p>
          {t(
            lang,
            "Acompanhe o movimento da rede e encontre sua próxima frequência.",
            "Follow the network and find your next frequency.",
          )}
        </p>
        <div className="network-stats">
          <div>
            <strong>
              {status === "ready" && data ? data.pilotCount : "—"}
            </strong>
            <span>{t(lang, "pilotos na região", "pilots in the region")}</span>
          </div>
          <div>
            <strong>{status === "ready" && data ? data.atcCount : "—"}</strong>
            <span>{t(lang, "posições ATC", "ATC positions")}</span>
          </div>
          <Icon name="plane" size={42} />
        </div>
        {status === "ready" && data && data.controllers.length > 0 && (
          <div className="frequency-list">
            {data.controllers.slice(0, 3).map((controller) => (
              <span key={controller.callsign}>
                {controller.callsign}
                <b>{controller.frequency}</b>
              </span>
            ))}
          </div>
        )}
        <div className="network-footer">
          <ActionLink href={links.radar}>
            {t(lang, "Abrir radar ao vivo", "Open live radar")}
          </ActionLink>
          <span className="network-status" role="status">
            {status === "loading" ? (
              t(lang, "Consultando a rede…", "Checking the network…")
            ) : status === "error" ? (
              <>
                {t(lang, "Dados indisponíveis.", "Data unavailable.")}{" "}
                <button
                  className="text-button"
                  onClick={() => {
                    setStatus("loading");
                    setAttempt(attempt + 1);
                  }}
                >
                  {t(lang, "Tentar novamente", "Try again")}
                </button>
              </>
            ) : (
              t(lang, "Atualização a cada 60 s · ", "Refreshes every 60 s · ") +
              (data?.updatedAt
                ? new Date(data.updatedAt).toISOString().slice(11, 16) + " UTC"
                : "")
            )}
          </span>
        </div>
        <p className="network-note">
          {t(
            lang,
            "Contagem regional aproximada. O mapa é ilustrativo.",
            "Approximate regional count. Map is illustrative.",
          )}
        </p>
      </div>
    </section>
  );
}
