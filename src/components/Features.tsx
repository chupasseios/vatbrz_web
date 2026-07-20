import styles from './Features.module.css';
import Image from 'next/image';
import LiveStats from './LiveStats';
import Link from 'next/link';
import { getNextBrazilianEvent } from '../services/vatsim';

export default async function Features({ dict, dictStats, lang }: { dict: any; dictStats: any; lang: string }) {
  const nextEvent = await getNextBrazilianEvent();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    });
  };

  return (
    <section className={styles.features} id="features">
      <div className={styles.header}>
        <h2 className={styles.title}>
          {dict.title1} {dict.title2}
        </h2>
        <p className={styles.subtitle}>
          {dict.subtitle}
        </p>
      </div>

      <div className={styles.grid}>
        <div className={`glass-panel ${styles.card}`}>
          <span className={styles.cardTag}>{dict.softwareTag}</span>
          <h3 className={styles.cardTitle}>{dict.softwareTitle1}<br />{dict.softwareTitle2}</h3>
          <p className={styles.cardText}>
            {dict.softwareText1}<br />
            {dict.softwareText2}
          </p>
        </div>

        <div className={styles.columnCards}>
          <div className={`glass-panel ${styles.card}`}>
            <span className={styles.cardTag}>{dict.communityTag}</span>
            <h3 className={styles.cardTitle}>{dict.communityTitle1}<br />{dict.communityTitle2}</h3>
            <p className={styles.cardText}>
              {dict.communityText}
            </p>
          </div>

          <div className={`glass-panel ${styles.card}`}>
            <span className={styles.cardTag} style={{ color: '#0DDB6E' }}>{dict.liveTag}</span>
            <h3 className={styles.cardTitle}>{dict.liveTitle1}<br />{dict.liveTitle2}</h3>
            <div className={styles.cardText}>
              {dict.liveText}
              <LiveStats dict={dictStats} />
            </div>
          </div>
        </div>

        <Link
          href={`/${lang}/events`}
          className={`glass-panel ${styles.card} ${styles.cardFull} ${nextEvent?.banner ? styles.cardFullWithBanner : styles.cardFullEmpty}`}
          aria-label={nextEvent
            ? `${dict.eventsSeeMore}: ${nextEvent.name}`
            : dict.eventsTitle1}
          aria-disabled={!nextEvent}
          tabIndex={nextEvent ? undefined : -1}
        >
          <div className={styles.cardContent}>
            <span className={styles.cardTag}>{nextEvent ? dict.eventsTag : dict.eventsEmptyTag}</span>
            <h3 className={styles.cardTitle}>
              {nextEvent ? nextEvent.name : (
                <>{dict.eventsTitle1}<br />{dict.eventsTitle2}</>
              )}
            </h3>
            
            {nextEvent ? (
              <div className={styles.eventInfo}>
                <div className={styles.eventTime}>
                  <span>{dict.eventsStart}</span>
                  {formatDate(nextEvent.start_time)}
                </div>
                <div className={styles.eventTime}>
                  <span>{dict.eventsEnd}</span>
                  {formatDate(nextEvent.end_time)}
                </div>
                <span className={styles.btnSeeMore}>
                  {dict.eventsSeeMore}
                </span>
              </div>
            ) : (
              <p className={styles.cardText}>
                {dict.eventsNoText}
              </p>
            )}
          </div>

          {nextEvent && nextEvent.banner && (
            <div className={styles.eventBanner}>
              <Image
                src={nextEvent.banner}
                alt={`Banner do evento ${nextEvent.name}`}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                style={{ objectFit: 'contain', objectPosition: 'center' }}
              />
            </div>
          )}
          
          {!nextEvent && (
            <div className={styles.emptyMascot}>
              <div className={styles.mascotGlow} aria-hidden="true" />
              <Image
                src="/assets/fanstasma.svg"
                alt={dict.eventsMascotAlt}
                width={514}
                height={399}
                sizes="(max-width: 768px) 70vw, 320px"
                className={styles.mascotImage}
              />
            </div>
          )}
        </Link>
      </div>
    </section>
  );
}
