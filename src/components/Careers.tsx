import styles from './Careers.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Careers({ dict, lang }: { dict: any; lang: string }) {
  return (
    <section className={styles.careers} id="resources">
      <div className={styles.header}>
        <h2 className={styles.title}>
          {dict.title1}<br />{dict.title2}
        </h2>
        <p className={styles.subtitle}>
          {dict.subtitle}
        </p>
      </div>

      <div className={styles.grid}>
        <Link href={`/${lang}/atc`} className={`glass-panel ${styles.card}`}>
          <div className={styles.cardBg}>
            <Image src="/assets/atc_home.png" alt="ATC" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </div>
          <div className={styles.cardGradient}></div>
          <span className={styles.cardTag}>{dict.tagATC}</span>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{dict.titleATC}</h3>
            <p className={styles.cardText}>
              {dict.textATC}
            </p>
          </div>
        </Link>

        <Link href={`/${lang}/piloto`} className={`glass-panel ${styles.card}`}>
          <div className={styles.cardBg}>
            <Image src="/assets/pilot_home_v2.png" alt="Pilot" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </div>
          <div className={styles.cardGradient}></div>
          <span className={styles.cardTag}>{dict.tagPilot}</span>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{dict.titlePilot}</h3>
            <p className={styles.cardText}>
              {dict.textPilot}
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
