import styles from './Careers.module.css';
import Image from 'next/image';

export default function Careers({ dict }: { dict: any }) {
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
        <div className={`glass-panel ${styles.card}`}>
          <div className={styles.cardBg}>
            <Image src="/assets/atc_home.png" alt="ATC" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className={styles.cardGradient}></div>
          <span className={styles.cardTag}>{dict.tagATC}</span>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{dict.titleATC}</h3>
            <p className={styles.cardText}>
              {dict.textATC}
            </p>
          </div>
        </div>

        <div className={`glass-panel ${styles.card}`}>
          <div className={styles.cardBg}>
            <Image src="/assets/pilot_home_v2.png" alt="Pilot" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className={styles.cardGradient}></div>
          <span className={styles.cardTag}>{dict.tagPilot}</span>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{dict.titlePilot}</h3>
            <p className={styles.cardText}>
              {dict.textPilot}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
