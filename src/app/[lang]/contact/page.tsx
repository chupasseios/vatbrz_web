import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import styles from './Contact.module.css';
import { getDictionary } from '@/getDictionary';

export default async function ContactPage({ params }: { params: Promise<{ lang: 'en' | 'pt-br' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <NavBar dict={dict.nav} lang={lang} />
      <main style={{ paddingTop: '64px', minHeight: '100vh', position: 'relative' }}>
        <div className={styles.container}>
          
          <div className={styles.header}>
            <h1 className={`${styles.title} glow-text`}>
              {dict.contact.title1} <span style={{ color: '#0DDB6E' }}>{dict.contact.title2}</span>
            </h1>
            <p className={styles.description}>
              {dict.contact.subtitle}
            </p>
          </div>

          <div className={styles.grid}>
            {/* Discord Support Card */}
            <div className={`glass-panel ${styles.card}`}>
              <h3 className={styles.cardTitle}>{dict.contact.discordTitle}</h3>
              <p className={styles.cardText}>
                {dict.contact.discordText}
              </p>
              <a href="https://community.vatsim.net/" target="_blank" rel="noopener noreferrer" className={styles.discordButton}>
                {dict.contact.discordButton}
              </a>
            </div>

            {/* Email Support Card */}
            <div className={`glass-panel ${styles.card}`}>
              <h3 className={styles.cardTitle}>{dict.contact.emailTitle}</h3>
              <p className={styles.cardText} style={{ marginBottom: '24px' }}>
                {dict.contact.emailText}
              </p>
              
              <div className={styles.emailsList}>
                <div className={styles.emailItem}>
                  <span className={styles.emailLabel}>{dict.contact.opsLabel}</span>
                  <a href={`mailto:${dict.contact.opsEmail}`} className={styles.emailAddress}>{dict.contact.opsEmail}</a>
                </div>
                <div className={styles.emailItem}>
                  <span className={styles.emailLabel}>{dict.contact.trainingLabel}</span>
                  <a href={`mailto:${dict.contact.trainingEmail}`} className={styles.emailAddress}>{dict.contact.trainingEmail}</a>
                </div>
                <div className={styles.emailItem}>
                  <span className={styles.emailLabel}>{dict.contact.supportLabel}</span>
                  <a href={`mailto:${dict.contact.supportEmail}`} className={styles.emailAddress}>{dict.contact.supportEmail}</a>
                </div>
                <div className={styles.emailItem}>
                  <span className={styles.emailLabel}>{dict.contact.directorLabel}</span>
                  <a href={`mailto:${dict.contact.directorEmail}`} className={styles.emailAddress}>{dict.contact.directorEmail}</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer dict={dict.footer} />
    </>
  );
}
