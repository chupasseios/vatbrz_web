import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ColorCard from '@/components/ColorCard';
import LogoCard from '@/components/LogoCard';
import styles from './Branding.module.css';
import Image from 'next/image';
import { getDictionary } from '@/getDictionary';

export default async function BrandingPage({ params }: { params: Promise<{ lang: 'en' | 'pt-br' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <NavBar dict={dict.nav} lang={lang} />
      <main style={{ paddingTop: '64px', minHeight: '100vh' }}>
        <div className={styles.container}>
          
          <div className={styles.header}>
            <h1 className={`${styles.title} glow-text`}>
              {dict.branding.title1} <span style={{ color: '#010EDB' }}>{dict.branding.title2}</span>
            </h1>
            <p className={styles.description}>
              {dict.branding.subtitle}
            </p>
          </div>

          <section className={styles.section} id="marca">
            <h2 className={styles.sectionTitle}>{dict.branding.brandTitle}</h2>
            <div className="glass-panel" style={{ padding: '40px', marginBottom: '32px' }}>
              <p className={styles.description} style={{ textAlign: 'left', margin: 0 }}>
                {dict.branding.brandDesc}
              </p>
            </div>
          </section>

          <section className={styles.section} id="tipografia">
            <h2 className={styles.sectionTitle}>{dict.branding.fontsTitle}</h2>
            <div className={styles.fontsGrid}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '40px', fontWeight: 800 }}>New Order</div>
                <div style={{ fontSize: '40px', fontWeight: 600 }}>New Order</div>
                <div style={{ fontSize: '40px', fontWeight: 400 }}>New Order</div>
                <div style={{ fontSize: '40px', fontWeight: 300 }}>New Order</div>
                <div style={{ fontSize: '40px', fontWeight: 200 }}>New Order</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'right' }}>
                <div style={{ fontSize: '40px', fontWeight: 800 }}>Ofelia Display</div>
                <div style={{ fontSize: '40px', fontWeight: 600 }}>Ofelia Display</div>
                <div style={{ fontSize: '40px', fontWeight: 400 }}>Ofelia Display</div>
                <div style={{ fontSize: '40px', fontWeight: 300 }}>Ofelia Display</div>
                <div style={{ fontSize: '40px', fontWeight: 200 }}>Ofelia Display</div>
              </div>
            </div>
            
            <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
              <a href="/fonts/VATBRZ_Fontes.zip" download className={styles.downloadBanner}>
                <span className={styles.downloadBadge}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '4px', marginTop: '-2px' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  {dict.branding.downloadFontsBadge}
                </span>
                <span className={styles.downloadText}>
                  {dict.branding.downloadFontsText1}<strong>{dict.branding.downloadFontsTextBold}</strong>{dict.branding.downloadFontsText2}
                </span>
                <span className={styles.downloadLink}>{dict.branding.downloadFontsLink}</span>
              </a>
            </div>
          </section>

          <section className={styles.section} id="cores">
            <h2 className={styles.sectionTitle}>{dict.branding.colorsTitle}</h2>
            
            <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Cores Primárias</h3>
            <div className={styles.colorsGrid} style={{ marginBottom: '40px' }}>
              <ColorCard hex="#050A2D" className={`${styles.colorCard} ${styles.lightText}`} style={{ background: '#050A2D' }} />
              <ColorCard hex="#010EDB" className={`${styles.colorCard} ${styles.lightText}`} style={{ background: '#010EDB' }} />
              <ColorCard hex="#FFFFFF" className={`${styles.colorCard} ${styles.darkText}`} style={{ background: '#FFFFFF' }} />
            </div>

            <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Cores Secundárias</h3>
            <div className={styles.colorsGrid}>
              <ColorCard hex="#0054DB" className={`${styles.colorCard} ${styles.lightText}`} style={{ background: '#0054DB' }} />
              <ColorCard hex="#0DDB6E" className={`${styles.colorCard} ${styles.darkText}`} style={{ background: '#0DDB6E' }} />
              <ColorCard hex="#FEDF00" className={`${styles.colorCard} ${styles.darkText}`} style={{ background: '#FEDF00' }} />
            </div>
          </section>

          <section className={styles.section} id="logos">
            <h2 className={styles.sectionTitle}>{dict.branding.logosTitle}</h2>
            
            <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Aplicações Principais</h3>
            <div className={styles.colorsGrid} style={{ marginBottom: '40px' }}>
              <LogoCard src="/logos/vatbrz_logowhite.svg" bg="#050A2D" downloadName="vatbrz_logowhite.svg" dict={dict.branding} />
              <LogoCard src="/logos/vatbrz_logowhite.svg" bg="#010EDB" downloadName="vatbrz_logowhite.svg" dict={dict.branding} />
              <LogoCard src="/logos/vatbrz_logodark.svg" bg="#FFFFFF" downloadName="vatbrz_logodark.svg" dict={dict.branding} />
            </div>

            <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Aplicações Secundárias</h3>
            <div className={styles.colorsGrid}>
              <LogoCard src="/logos/vatbrz_logodark.svg" bg="#FEDF00" downloadName="vatbrz_logodark.svg" dict={dict.branding} />
              <LogoCard src="/logos/vatbrz_logodark.svg" bg="#0DDB6E" downloadName="vatbrz_logodark.svg" dict={dict.branding} />
              <LogoCard src="/logos/vatbrz_logowhite.svg" bg="#0054DB" downloadName="vatbrz_logowhite.svg" dict={dict.branding} />
            </div>
          </section>

          <section className={styles.section} id="departamentos">
            <h2 className={styles.sectionTitle}>{dict.branding.deptTitle}</h2>
            <div className={styles.departmentsList}>
              <div className={styles.departmentRow}>
                <div className={styles.colorBadge} style={{ background: '#050A2D' }}></div>
                <div className={styles.departmentName}>vatbrz</div>
              </div>
              <div className={styles.departmentRow}>
                <div className={styles.colorBadge} style={{ background: '#010EDB' }}></div>
                <div className={styles.departmentName}>{dict.branding.deptMarketing}</div>
              </div>
              <div className={styles.departmentRow}>
                <div className={styles.colorBadge} style={{ background: '#0054DB' }}></div>
                <div className={styles.departmentName}>{dict.branding.deptTech}</div>
              </div>
              <div className={styles.departmentRow}>
                <div className={styles.colorBadge} style={{ background: '#0DDB6E' }}></div>
                <div className={styles.departmentName}>{dict.branding.deptTraining}</div>
              </div>
              <div className={styles.departmentRow}>
                <div className={styles.colorBadge} style={{ background: '#FEDF00' }}></div>
                <div className={styles.departmentName}>{dict.branding.deptOps}</div>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer dict={dict.footer} />
    </>
  );
}
