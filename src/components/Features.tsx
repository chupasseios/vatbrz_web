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

        <div className={`glass-panel ${styles.card} ${styles.cardFull}`}>
          {nextEvent && nextEvent.banner && (
            <div className={styles.eventBanner}>
              <Image src={nextEvent.banner} alt="Event Banner" fill style={{ objectFit: 'contain', objectPosition: 'right' }} />
            </div>
          )}
          <div className={styles.cardContent} style={{ maxWidth: '60%', zIndex: 1 }}>
            <span className={styles.cardTag}>{dict.eventsTag}</span>
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
                <Link href={`/${lang}/events`} className={styles.btnSeeMore}>
                  {dict.eventsSeeMore}
                </Link>
              </div>
            ) : (
              <p className={styles.cardText}>
                {dict.eventsNoText}
              </p>
            )}
          </div>
          
          {!nextEvent && (
            <div className={styles.sadAirplaneContainer}>
              <div className={styles.sadAirplane}>✈️</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
