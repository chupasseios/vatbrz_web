'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavBar.module.css';
import LanguageSwitcher from './LanguageSwitcher';

export default function NavBar({ dict, lang }: { dict: any; lang: string }) {
  const pathname = usePathname();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    // Check if we are currently on the root language page
    if (pathname === `/${lang}` || pathname === `/${lang}/`) {
      e.preventDefault();
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Update URL hash without causing a jump
        window.history.pushState(null, '', `#${targetId}`);

        const startY = window.scrollY;
        const targetY = targetElement.getBoundingClientRect().top + window.scrollY + 60;
        const distance = targetY - startY;
        const duration = 800; // ms for a slower, smoother effect
        let startTime: number | null = null;

        const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          window.scrollTo(0, startY + distance * easeInOut(progress));
          
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };

        requestAnimationFrame(step);
      }
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.left}>
          <Link href={`/${lang}`}>
            <Image src="/logos/vatbrz_logowhite.svg" alt="VATBRZ Logo" width={180} height={55} style={{ objectFit: 'contain' }} priority />
          </Link>
        </div>
        <div className={styles.center}>
          <Link href={`/${lang}/#faq`} onClick={(e) => handleNavClick(e, 'faq')} className={styles.navLink}>{dict.about}</Link>
          <Link href={`/${lang}/#features`} onClick={(e) => handleNavClick(e, 'features')} className={styles.navLink}>{dict.community}</Link>
          <Link href={`/${lang}/#resources`} onClick={(e) => handleNavClick(e, 'resources')} className={styles.navLink}>{dict.careers}</Link>
          <div className={styles.dropdownContainer}>
            <span className={styles.navLink} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              {dict.resources}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <div className={styles.dropdownMenu}>
              <Link href={`/${lang}/branding`} className={styles.dropdownItem}>{dict.branding}</Link>
              <a href="https://atc.vatsim.com.br/" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>{dict.documents}</a>
              <Link href={`/${lang}/staff`} className={styles.dropdownItem}>{dict.staff}</Link>
              <Link href={`/${lang}/contact`} className={styles.dropdownItem}>{dict.contact}</Link>
            </div>
          </div>
        </div>
        <div className={styles.right} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '8px', 
            padding: '8px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#A0A5D6',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#A0A5D6' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </button>
          <LanguageSwitcher currentLang={lang} />
          <a href="https://vatsim.net/join" target="_blank" rel="noopener noreferrer" className={styles.loginButton}>{dict.login}</a>
        </div>
      </div>
    </nav>
  );
}
