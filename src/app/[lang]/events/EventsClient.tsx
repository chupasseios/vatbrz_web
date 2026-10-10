"use client";
import { useState } from "react";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import type { VatsimEvent } from "@/services/vatsim";
import Icon from "@/components/Icon";
import { ActionLink } from "@/components/PortalUI";
import { t, safeExternalUrl } from "@/lib/portal";

export default function EventsClient({
  initialEvents,
  unavailable,
  lang,
  referenceTime,
}: {
  initialEvents: VatsimEvent[];
  unavailable: boolean;
  lang: string;
  referenceTime: number;
}) {
  const [filter, setFilter] = useState("all");
  const [zone, setZone] = useState("America/Sao_Paulo");
  const events = initialEvents.filter(
    (e) =>
      filter === "all" ||
      (filter === "live"
        ? Date.parse(e.start_time) <= referenceTime
        : Date.parse(e.start_time) > referenceTime),
  );
  const date = (value: string) =>
    new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: zone,
    }).format(new Date(value));
  const calendar = (event: VatsimEvent) => {
    const description =
      new DOMParser().parseFromString(
        DOMPurify.sanitize(event.short_description || event.name),
        "text/html",
      ).body.textContent || event.name;
    const escape = (s: string) =>
      s
        .replace(/\\/g, "\\\\")
        .replace(/\r?\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
    const stamp = (s: string) =>
      new Date(s)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//VATBRZ//Events//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:vatbrz-" + event.id + "@vatbrz.net",
      "DTSTAMP:" + stamp(new Date().toISOString()),
      "DTSTART:" + stamp(event.start_time),
      "DTEND:" + stamp(event.end_time),
      "SUMMARY:" + escape(event.name),
      "DESCRIPTION:" + escape(description),
      "LOCATION:" + escape(event.airports.map((a) => a.icao).join(", ")),
      ...(safeExternalUrl(event.link)
        ? ["URL:" + safeExternalUrl(event.link)]
        : []),
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    // Fold by UTF-8 byte length as required by iCalendar, without splitting a character.
    const fold = (line: string) => {
      let out = "",
        current = "",
        length = 0;
      for (const char of line) {
        const bytes = new TextEncoder().encode(char).length;
        if (length + bytes > 74) {
          out += current + "\r\n";
          current = " ";
          length = 1;
        }
        current += char;
        length += bytes;
      }
      return out + current;
    };
    const url = URL.createObjectURL(
      new Blob([lines.map(fold).join("\r\n") + "\r\n"], {
        type: "text/calendar;charset=utf-8",
      }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "vatbrz-event-" + event.id + ".ics";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <>
      <div className="events-toolbar">
        <div
          className="filter-row"
          aria-label={t(lang, "Filtrar eventos", "Filter events")}
        >
          {[
            ["all", t(lang, "Todos os eventos", "All events")],
            ["live", t(lang, "Em andamento", "In progress")],
            ["upcoming", t(lang, "Próximos", "Upcoming")],
          ].map(([id, label]) => (
            <button
              key={id}
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="timezone-select">
          <Icon name="clock" size={16} />
          {t(lang, "Horários em", "Times in")}
          <select value={zone} onChange={(e) => setZone(e.target.value)}>
            <option value="America/Sao_Paulo">
              {t(lang, "Brasília (UTC−3)", "Brasília (UTC−3)")}
            </option>
            <option value="UTC">UTC / Zulu</option>
          </select>
        </label>
      </div>
      <p className="result-count" role="status">
        {events.length} {t(lang, events.length === 1 ? "evento encontrado" : "eventos encontrados", events.length === 1 ? "event found" : "events found")}
      </p>
      {events.length === 0 ? (
        <div className="empty-state">
          <Icon name="calendar" size={42} />
          <span
            className="eyebrow"
            style={{ display: "block", marginBottom: 12 }}
          >
            {t(lang, "AGENDA VATBRZ", "VATBRZ CALENDAR")}
          </span>
          <h3>
            {t(
              lang,
              unavailable
                ? "A agenda está temporariamente indisponível."
                : "Nenhum evento neste momento.",
              unavailable
                ? "The calendar is temporarily unavailable."
                : "No events right now.",
            )}
          </h3>
          <p>
            {t(
              lang,
              unavailable
                ? "Não foi possível consultar a VATSIM. Tente novamente ou confira a agenda oficial."
                : "Assim que um novo evento brasileiro for publicado, ele aparecerá aqui. Enquanto isso, consulte a agenda global da rede.",
              unavailable
                ? "Could not reach VATSIM. Try again or check the official calendar."
                : "New Brazilian events will appear here when published. In the meantime, explore the network’s global calendar.",
            )}
          </p>
          <div className="event-actions" style={{ justifyContent: "center" }}>
            {unavailable && (
              <button
                className="button button-secondary"
                onClick={() => window.location.reload()}
              >
                <Icon name="refresh" size={16} />
                {t(lang, "Tentar novamente", "Try again")}
              </button>
            )}
            <ActionLink href="https://my.vatsim.net/events">
              {t(lang, "Agenda global VATSIM", "VATSIM global calendar")}
            </ActionLink>
            {filter !== "all" && (
              <button
                className="button button-secondary"
                onClick={() => setFilter("all")}
              >
                {t(lang, "Limpar filtro", "Clear filter")}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="event-list">
          {events.map((event) => (
            <article
              className="event-card"
              key={event.id}
              id={"event-" + event.id}
            >
              <div className="event-banner">
                {event.banner && safeExternalUrl(event.banner) ? (
                  <Image
                    src={event.banner}
                    alt={event.name}
                    fill
                    unoptimized
                    sizes="(max-width: 560px) 100vw, 45vw"
                  />
                ) : (
                  <Icon name="calendar" size={70} />
                )}
              </div>
              <div className="event-content">
                <span className="eyebrow">
                  {Date.parse(event.start_time) <= referenceTime
                    ? t(lang, "EM ANDAMENTO", "IN PROGRESS")
                    : t(lang, "PRÓXIMO ENCONTRO", "UPCOMING EVENT")}
                </span>
                <h2>{event.name}</h2>
                <div
                  className="event-excerpt"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(event.short_description || "", {
                      ALLOWED_TAGS: ["p", "br", "strong", "em"],
                      ALLOWED_ATTR: [],
                    }),
                  }}
                />
                <div className="event-meta">
                  <span>
                    <Icon name="calendar" size={16} />
                    {date(event.start_time)}
                  </span>
                  <span>
                    <Icon name="clock" size={16} />
                    {t(lang, "Até ", "Until ")}
                    {date(event.end_time)}
                  </span>
                </div>
                <div className="event-airports">
                  {event.airports.map((airport, i) => (
                    <span key={airport.icao + i}>{airport.icao}</span>
                  ))}
                </div>
                <div className="event-actions">
                  {safeExternalUrl(event.link) && (
                    <ActionLink href={safeExternalUrl(event.link)!}>
                      {t(lang, "Página do evento", "Event page")}
                    </ActionLink>
                  )}
                  <button
                    className="button button-secondary"
                    onClick={() => calendar(event)}
                  >
                    <Icon name="download" size={16} />
                    {t(lang, "Salvar no calendário", "Save to calendar")}
                  </button>
                </div>
              </div>
              <details className="event-details">
                <summary>
                  {t(
                    lang,
                    "Briefing e informações do evento",
                    "Event briefing and details",
                  )}
                </summary>
                <div
                  className="event-description"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(event.description || "", {
                      FORBID_TAGS: [
                        "style",
                        "iframe",
                        "form",
                        "input",
                        "button",
                      ],
                      FORBID_ATTR: ["style"],
                    }),
                  }}
                />
              </details>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
