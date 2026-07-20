'use client';
import { useState, useEffect, useRef } from 'react';

interface Pilot {
  callsign: string;
  latitude: number;
  longitude: number;
  heading: number;
}

export default function LiveStats({ dict }: { dict: any }) {
  const [pilotCount, setPilotCount] = useState<number | null>(null);
  const [atcCount, setAtcCount] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      // Cancel previous request if still pending
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const res = await fetch('/api/live-stats', { signal: abortRef.current.signal });
        if (!res.ok) return;
        const data = await res.json();
        setPilotCount(data.pilotCount);
        setAtcCount(data.atcCount);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch live stats:', err);
        }
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, []);


  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      {/* Generic Brazil map watermark background */}
      <img 
        src="/assets/brazil-map.svg" 
        alt="" 
        style={{ 
          position: 'absolute', 
          top: '-10px', 
          right: '-20px', 
          width: '240px', 
          height: '240px', 
          objectFit: 'contain', 
          opacity: 0.2,
          pointerEvents: 'none'
        }} 
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '40px' }}>
          <div>
            <div style={{ fontSize: '48px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {pilotCount !== null ? pilotCount : '...'}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {dict.pilots}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '48px', fontWeight: 800, color: '#0DDB6E', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {atcCount !== null ? atcCount : '...'}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {dict.atc}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px', position: 'relative', zIndex: 1 }}>
        <a 
          href="https://vatsim-radar.com/" 
          target="_blank" 
          rel="noreferrer"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)' }}
        >
          <img src="/assets/radarlogo.svg" alt="" style={{ height: '18px' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{dict.radar}</span>
        </a>
      </div>

    </div>
  );
}
