'use client';

import styles from './Events.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import type { VatsimEvent } from '@/services/vatsim';

interface EventsClientProps {
  initialEvents: VatsimEvent[];
  dict: any;
  lang: string;
}

export default function EventsClient({ initialEvents, dict, lang }: EventsClientProps) {
  const [events] = useState<VatsimEvent[]>(initialEvents);
  const [mainEventId, setMainEventId] = useState<number | null>(
    initialEvents.length > 0 ? initialEvents[0].id : null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const mainEvent = events.find(e => e.id === mainEventId) || events[0] || null;
  const upcomingEvents = mainEvent ? events.filter(e => e.id !== mainEvent.id) : [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(lang === 'pt-br' ? 'pt-BR' : 'en-US', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    });
  };

  const handleSelectEvent = (id: number) => {
    // 1. Inicia transição (fade out do conteúdo atual)
    setIsTransitioning(true);

    // 2. Animação manual de scroll suave com requestAnimationFrame
    const startY = window.scrollY;
    const targetY = (topRef.current?.offsetTop ?? 0) - 80; // 80px offset para a navbar
    const distance = targetY - startY;
    const duration = 600; // ms
    let startTime: number | null = null;

    const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOut(progress));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // 3. Após o scroll terminar, troca o evento com fade-in
        setMainEventId(id);
        setIsTransitioning(false);
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <div>
      <div ref={topRef} className={styles.header}>
        <h1 className={styles.title}>{dict.eventsTag}</h1>
        <Link href={`/${lang}`} className={styles.btnBack}>
          ← {dict.eventsBack}
        </Link>
      </div>

      {mainEvent ? (
        <div
          className={styles.mainEvent}
          style={{
            opacity: isTransitioning ? 0 : 1,
            transition: 'opacity 0.4s ease',
          }}
        >
          {mainEvent.banner && (
            <div className={styles.mainBanner}>
              <Image src={mainEvent.banner} alt={mainEvent.name} fill style={{ objectFit: 'cover' }} priority />
            </div>
          )}
          <div className={styles.mainContent}>
            <h2 className={styles.mainTitle}>{mainEvent.name}</h2>
            <div className={styles.timeContainer}>
              <div className={styles.timeBlock}>
                <span className={styles.timeLabel}>{dict.eventsStart}</span>
                <span className={styles.timeValue}>{formatDate(mainEvent.start_time)}</span>
              </div>
              <div className={styles.timeBlock}>
                <span className={styles.timeLabel}>{dict.eventsEnd}</span>
                <span className={styles.timeValue}>{formatDate(mainEvent.end_time)}</span>
              </div>
            </div>
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(mainEvent.description) }}
            />
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>{dict.eventsNoText}</div>
      )}

      {upcomingEvents.length > 0 && (
        <>
          <h3 className={styles.subtitle}>{dict.eventsUpcoming}</h3>
          <div className={styles.grid}>
            {upcomingEvents.map(event => (
              <div key={event.id} className={styles.card}>
                <h4 className={styles.cardTitle}>{event.name}</h4>
                <div className={styles.timeBlock}>
                  <span className={styles.timeLabel}>{dict.eventsStart}</span>
                  <span className={styles.timeValue} style={{ fontSize: '14px' }}>{formatDate(event.start_time)}</span>
                </div>
                <div className={styles.timeBlock}>
                  <span className={styles.timeLabel}>{dict.eventsEnd}</span>
                  <span className={styles.timeValue} style={{ fontSize: '14px', color: '#8A8FBA' }}>{formatDate(event.end_time)}</span>
                </div>
                <button
                  onClick={() => handleSelectEvent(event.id)}
                  className={styles.btnDetails}
                >
                  {dict.eventsSeeMore}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
