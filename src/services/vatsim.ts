export interface VatsimEvent {
  id: number;
  name: string;
  link: string;
  organisers: {
    region: string;
    division: string;
    subdivision: string | null;
  }[];
  airports: { icao: string }[];
  start_time: string;
  end_time: string;
  short_description: string;
  description: string;
  banner: string | null;
}
export interface EventResult {
  events: VatsimEvent[];
  unavailable: boolean;
  referenceTime: number;
}
export async function getBrazilianEventsResult(): Promise<EventResult> {
  try {
    const response = await fetch("https://my.vatsim.net/api/v1/events/all", {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Events API: " + response.status);
    const json = await response.json();
    if (!Array.isArray(json.data)) throw new Error("Invalid events response");
    const now = Date.now();
    const events: VatsimEvent[] = json.data.filter(
      (event: VatsimEvent) =>
        typeof event.id === "number" &&
        typeof event.name === "string" &&
        Number.isFinite(Date.parse(event.start_time)) &&
        Date.parse(event.end_time) >= now &&
        (event.organisers?.some((org) => org.division === "BRZ") ||
          event.airports?.some((airport) =>
            /^(SB|SD|SN|SW|SS|SI|SJ)[A-Z]{2}$/.test(airport.icao.toUpperCase()),
          )),
    );
    return {
      events: events.sort(
        (a, b) => Date.parse(a.start_time) - Date.parse(b.start_time),
      ),
      unavailable: false,
      referenceTime: now,
    };
  } catch (error) {
    console.error("VATSIM events unavailable:", error);
    return { events: [], unavailable: true, referenceTime: Date.now() };
  }
}
export async function getBrazilianEvents() {
  return (await getBrazilianEventsResult()).events;
}
export async function getNextBrazilianEvent() {
  return (await getBrazilianEvents())[0] || null;
}
