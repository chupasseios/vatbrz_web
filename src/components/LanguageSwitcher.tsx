'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './LanguageSwitcher.module.css';

function BrazilFlag() {
  return (
    <svg viewBox="0 0 28 20" aria-hidden="true">
      <rect width="28" height="20" rx="2" fill="#009B3A" />
      <path d="M14 2.8 25 10 14 17.2 3 10Z" fill="#FFDF00" />
      <circle cx="14" cy="10" r="4.2" fill="#002776" />
      <path d="M10.2 9.1c2.5-.7 5.4-.2 7.7 1.4" fill="none" stroke="#fff" strokeWidth=".75" />
    </svg>
  );
}

function UnitedStatesFlag() {
  return (
    <svg viewBox="0 0 28 20" aria-hidden="true">
      <defs>
        <clipPath id="us-flag-clip"><rect width="28" height="20" rx="2" /></clipPath>
      </defs>
      <g clipPath="url(#us-flag-clip)">
        <rect width="28" height="20" fill="#fff" />
        {[0, 3.08, 6.16, 9.24, 12.32, 15.4, 18.48].map((y) => (
          <rect key={y} y={y} width="28" height="1.54" fill="#B22234" />
        ))}
        <rect width="12" height="10.8" fill="#3C3B6E" />
        <g fill="#fff">
          <circle cx="2" cy="2" r=".55" /><circle cx="5" cy="2" r=".55" /><circle cx="8" cy="2" r=".55" /><circle cx="11" cy="2" r=".55" />
          <circle cx="3.5" cy="4.2" r=".55" /><circle cx="6.5" cy="4.2" r=".55" /><circle cx="9.5" cy="4.2" r=".55" />
          <circle cx="2" cy="6.4" r=".55" /><circle cx="5" cy="6.4" r=".55" /><circle cx="8" cy="6.4" r=".55" /><circle cx="11" cy="6.4" r=".55" />
          <circle cx="3.5" cy="8.6" r=".55" /><circle cx="6.5" cy="8.6" r=".55" /><circle cx="9.5" cy="8.6" r=".55" />
        </g>
      </g>
    </svg>
  );
}

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname();

  const hrefFor = (language: 'pt-br' | 'en') => {
    if (!pathname) return `/${language}`;
    const segments = pathname.split('/');
    segments[1] = language;
    return segments.join('/');
  };

  const languages = [
    { code: 'pt-br' as const, label: 'Português do Brasil', flag: <BrazilFlag /> },
    { code: 'en' as const, label: 'English', flag: <UnitedStatesFlag /> },
  ];

  return (
    <nav className={styles.switcher} aria-label="Selecionar idioma">
      {languages.map((language) => {
        const isActive = currentLang === language.code;
        return (
          <Link
            key={language.code}
            href={hrefFor(language.code)}
            className={`${styles.option} ${isActive ? styles.active : ''}`}
            aria-label={language.label}
            aria-current={isActive ? 'page' : undefined}
            title={language.label}
          >
            {language.flag}
          </Link>
        );
      })}
    </nav>
  );
}
