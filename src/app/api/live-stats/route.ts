import { NextResponse } from 'next/server';

// This runs on the server — downloads the full VATSIM JSON (~5-10MB) 
// server-side, filters to Brazil, and returns only ~50-100 pilots to the client.

interface Pilot {
  callsign: string;
  latitude: number;
  longitude: number;
  heading: number;
}

const brazilPolygon = [
  [-73.98, -7.53], [-70.00, 2.00], [-60.20, 5.27], [-51.00, 4.00],
  [-34.79, -5.20], [-34.80, -8.00], [-39.00, -18.00], [-40.80, -22.90],
  [-48.00, -28.00], [-53.30, -33.75], [-58.00, -27.00], [-54.60, -25.50],
  [-58.00, -19.00], [-65.00, -10.00]
];

function pointInPolygon(point: number[], vs: number[][]): boolean {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export interface LiveStatsResponse {
  pilotCount: number;
  atcCount: number;
  pilots: Pilot[];
}

export async function GET() {
  try {
    const res = await fetch('https://data.vatsim.net/v3/vatsim-data.json', {
      next: { revalidate: 60 } // Cache for 60 seconds server-side
    });

    if (!res.ok) {
      return NextResponse.json({ pilotCount: 0, atcCount: 0, pilots: [] }, { status: 502 });
    }

    const data = await res.json();

    // Count ATC in Brazil
    const controllers = data.controllers.filter((c: any) =>
      c.callsign.match(/^(SB|SD|SN|SW|SS|SI|SJ)[A-Z]{2}_/) && c.facility !== 0
    );

    // Filter pilots in Brazil
    const pilotsInBr: Pilot[] = data.pilots
      .filter((p: any) => {
        if (p.latitude < -33.75 || p.latitude > 5.27 || p.longitude < -73.98 || p.longitude > -34.79) {
          return false;
        }
        let hasBrPlan = false;
        if (p.flight_plan) {
          const dep = p.flight_plan.departure || '';
          const arr = p.flight_plan.arrival || '';
          if (dep.match(/^(SB|SD|SN|SW|SS|SI|SJ)[A-Z]{2}/) || arr.match(/^(SB|SD|SN|SW|SS|SI|SJ)[A-Z]{2}/)) {
            hasBrPlan = true;
          }
        }
        return hasBrPlan || pointInPolygon([p.longitude, p.latitude], brazilPolygon);
      })
      .map((p: any) => ({
        callsign: p.callsign,
        latitude: p.latitude,
        longitude: p.longitude,
        heading: p.heading,
      }));

    const response: LiveStatsResponse = {
      pilotCount: pilotsInBr.length,
      atcCount: controllers.length,
      pilots: pilotsInBr,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (err) {
    console.error('Failed to fetch VATSIM live data:', err);
    return NextResponse.json({ pilotCount: 0, atcCount: 0, pilots: [] }, { status: 500 });
  }
}
