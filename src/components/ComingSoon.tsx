import Image from 'next/image';
import Link from 'next/link';
import styles from './ComingSoon.module.css';

interface ComingSoonContent {
  eyebrow: string;
  title1: string;
  title2: string;
  description: string;
  tease: string;
  statusLabel: string;
  statusValue: string;
  back: string;
  mascotAlt: string;
}

export default function ComingSoon({ content, lang }: { content: ComingSoonContent; lang: string }) {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.panel}>
          <div className={styles.content}>
            <span className={styles.eyebrow}>{content.eyebrow}</span>
            <h1 className={styles.title}>
              <span className={styles.titlePrimary}>{content.title1}</span>
              <span className={styles.titleSecondary}>{content.title2}</span>
            </h1>
            <p className={styles.description}>{content.description}</p>
            <p className={styles.tease}>{content.tease}</p>

            <div className={styles.actions}>
              <Link href={`/${lang}`} className={styles.backButton}>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                {content.back}
              </Link>
              <div className={styles.status}>
                <span className={styles.statusDot} aria-hidden="true" />
                <span>
                  <small>{content.statusLabel}</small>
                  {content.statusValue}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.visual}>
            <div className={styles.radar} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <Image
              src="/assets/fanstasma.svg"
              alt={content.mascotAlt}
              width={514}
              height={399}
              sizes="(max-width: 800px) 72vw, 360px"
              className={styles.mascot}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
