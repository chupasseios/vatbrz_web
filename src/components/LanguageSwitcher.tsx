'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname();
  const isEn = currentLang === 'en';
  
  // Reconstruct path for the other language
  const toggleLang = isEn ? 'pt-br' : 'en';
  
  const getHref = () => {
    if (!pathname) return `/${toggleLang}`;
    // Replace the first path segment (the lang) with the new lang
    const segments = pathname.split('/');
    segments[1] = toggleLang;
    return segments.join('/');
  };

  return (
    <Link 
      href={getHref()}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '6px 12px',
        fontSize: '12px',
        fontWeight: 600,
        color: '#fff',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
    >
      {isEn ? 'Language' : 'Linguagem'}
    </Link>
  );
}
