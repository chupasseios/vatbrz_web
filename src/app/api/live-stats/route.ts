import { NextResponse } from "next/server";

// This runs on the server — downloads the full VATSIM JSON (~5-10MB)
// server-side, filters to Brazil, and returns only ~50-100 pilots to the client.

interface Pilot {
  callsign: string;
  latitude: number;
  longitude: number;
  heading: number;
}

interface NetworkPilot extends Pilot {
  flight_plan?: { departure?: string; arrival?: string } | null;
}

interface NetworkController {
  callsign: string;
  facility: number;
  frequency: string;
  name: string;
}

const brazilPolygon = [
  [-73.98, -7.53],
  [-70.0, 2.0],
  [-60.2, 5.27],
  [-51.0, 4.0],
  [-34.79, -5.2],
  [-34.8, -8.0],
  [-39.0, -18.0],
  [-40.8, -22.9],
  [-48.0, -28.0],
  [-53.3, -33.75],
  [-58.0, -27.0],
  [-54.6, -25.5],
  [-58.0, -19.0],
  [-65.0, -10.0],
];

function pointInPolygon(point: number[], vs: number[][]): boolean {
  const x = point[0],
    y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0],
      yi = vs[i][1];
    const xj = vs[j][0],
      yj = vs[j][1];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export interface LiveStatsResponse {
  pilotCount: number;
  atcCount: number;
  pilots: Pilot[];
  controllers: Pick<NetworkController, "callsign" | "frequency" | "name">[];
  updatedAt: string;
}

// Cache only the small regional result. The global feed exceeds Next's 2 MB
// fetch-cache limit. The CDN also receives a 60-second cache policy below.
let cachedStats: { payload: LiveStatsResponse; expiresAt: number } | null = null;
const cacheHeaders = { "Cache-Control": "s-maxage=60, stale-while-revalidate=30" };

export async function GET() {
  if (cachedStats && cachedStats.expiresAt > Date.now()) {
    return NextResponse.json(cachedStats.payload, { headers: cacheHeaders });
  }
  try {
    const res = await fetch("https://data.vatsim.net/v3/vatsim-data.json", {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { pilotCount: 0, atcCount: 0, pilots: [] },
        { status: 502 },
      );
    }

    const data: {
      pilots: NetworkPilot[];
      controllers: NetworkController[];
      general?: { update_timestamp?: string };
    } = await res.json();
    if (!Array.isArray(data.pilots) || !Array.isArray(data.controllers)) {
      return NextResponse.json(
        { error: "Invalid network data" },
        { status: 502 },
      );
    }

    // Count ATC in Brazil
    const controllers = data.controllers.filter(
      (c) =>
        c.callsign.match(/^(SB|SD|SN|SW|SS|SI|SJ)[A-Z]{2}_/) && c.facility > 0,
    );

    // Filter pilots in Brazil
    const pilotsInBr: Pilot[] = data.pilots
      .filter((p) => {
        if (
          p.latitude < -33.75 ||
          p.latitude > 5.27 ||
          p.longitude < -73.98 ||
          p.longitude > -34.79
        ) {
          return false;
        }
        let hasBrPlan = false;
        if (p.flight_plan) {
          const dep = p.flight_plan.departure || "";
          const arr = p.flight_plan.arrival || "";
          if (
            dep.match(/^(SB|SD|SN|SW|SS|SI|SJ)[A-Z]{2}/) ||
            arr.match(/^(SB|SD|SN|SW|SS|SI|SJ)[A-Z]{2}/)
          ) {
            hasBrPlan = true;
          }
        }
        return (
          hasBrPlan || pointInPolygon([p.longitude, p.latitude], brazilPolygon)
        );
      })
      .map((p) => ({
        callsign: p.callsign,
        latitude: p.latitude,
        longitude: p.longitude,
        heading: p.heading,
      }));

    const response: LiveStatsResponse = {
      pilotCount: pilotsInBr.length,
      atcCount: controllers.length,
      pilots: pilotsInBr,
      controllers: controllers.map(({ callsign, frequency, name }) => ({
        callsign,
        frequency,
        name,
      })),
      updatedAt: data.general?.update_timestamp || new Date().toISOString(),
    };

    cachedStats = { payload: response, expiresAt: Date.now() + 60_000 };
    return NextResponse.json(response, { headers: cacheHeaders });
  } catch (err) {
    console.error("Failed to fetch VATSIM live data:", err);
    return NextResponse.json(
      { pilotCount: 0, atcCount: 0, pilots: [] },
      { status: 500 },
    );
  }
}
