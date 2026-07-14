import { getBrazilianEvents } from '@/services/vatsim';
import { NextResponse } from 'next/server';

export async function GET() {
  const events = await getBrazilianEvents();
  return NextResponse.json(events, {
    headers: {
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=300',
    },
  });
}
