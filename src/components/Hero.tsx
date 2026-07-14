import styles from './Hero.module.css';
import Image from 'next/image';

export default function Hero({ dict }: { dict: any }) {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroBackground}>
        <Image src="/assets/banner_mocape.png" alt="Banner Mockup" fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
        <div className={styles.heroOverlay}></div>
      </div>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          {dict.title1}<br />
          {dict.title2}<br />
          <span className={styles.brazilGradient}>{dict.title3}</span>
        </h1>
        <p className={styles.subtitle}>
          {dict.subtitle1}<br />
          {dict.subtitle2}<br />
          {dict.subtitle3}
        </p>
        
        <a href="https://my.vatsim.net/register" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
          {dict.cta}
        </a>
        
        <div className={styles.toolsSection}>
          <div className={styles.toolsText}>{dict.toolsText}</div>
          <div className={styles.toolsLogos}>
            <Image src="/assets/flightsimulator.svg" alt="Flight Simulator" width={160} height={48} style={{ objectFit: 'contain' }} />
            <Image src="/assets/p3d.svg" alt="Prepar3D" width={160} height={48} style={{ objectFit: 'contain' }} />
            <Image src="/assets/xp11.svg" alt="X-Plane 11" width={160} height={48} style={{ objectFit: 'contain' }} />
            <Image src="/assets/xp12.svg" alt="X-Plane 12" width={160} height={48} style={{ objectFit: 'contain' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
