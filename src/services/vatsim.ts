export interface VatsimEvent {
  id: number;
  name: string;
  link: string;
  organisers: { region: string; division: string; subdivision: string | null }[];
  airports: { icao: string }[];
  start_time: string;
  end_time: string;
  short_description: string;
  description: string;
  banner: string | null;
}

export async function getBrazilianEvents(): Promise<VatsimEvent[]> {
  try {
    const res = await fetch('https://my.vatsim.net/api/v1/events/all', {
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      console.error('Failed to fetch VATSIM events:', res.statusText);
      return [];
    }

    const json = await res.json();
    const events: VatsimEvent[] = json.data || [];
    const now = new Date();

    const brazilianEvents = events.filter(event => {
      const endTime = new Date(event.end_time);
      if (endTime < now) return false;

      // Verifica se o organizador é a divisão do Brasil
      const isBrzOrganizer = event.organisers.some(org => org.division === 'BRZ');

      // Ou verifica se algum aeroporto é no Brasil (prefixos SB, SD, SN, SW, SS, SI, SJ)
      const isBrzAirport = event.airports.some(apt => {
        const prefix2 = apt.icao.substring(0, 2).toUpperCase();
        return ['SB', 'SD', 'SN', 'SW', 'SS', 'SI', 'SJ'].includes(prefix2);
      });

      return isBrzOrganizer || isBrzAirport;
    });

    brazilianEvents.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    return brazilianEvents;
  } catch (error) {
    console.error('Error fetching VATSIM events:', error);
    return [];
  }
}

export async function getNextBrazilianEvent(): Promise<VatsimEvent | null> {
  const events = await getBrazilianEvents();
  return events.length > 0 ? events[0] : null;
}
