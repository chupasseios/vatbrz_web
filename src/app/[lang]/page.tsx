import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Careers from '@/components/Careers';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { getDictionary } from '@/getDictionary';

export default async function Home({ params }: { params: Promise<{ lang: 'en' | 'pt-br' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <NavBar dict={dict.nav} lang={lang} />
      <main style={{ paddingTop: '0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', pointerEvents: 'none', zIndex: 0, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'relative', width: '1000px', height: '100%' }}>
            <div style={{ position: 'absolute', top: '0', left: '-50px', width: '935px', height: '689px', opacity: 0.6 }}>
              <Image src="/assets/light.svg" alt="" fill style={{ objectFit: 'contain' }} priority />
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Hero dict={dict.hero} />
        </div>
        <Features dict={dict.features} dictStats={dict.liveStats} lang={lang} />
        <Careers dict={dict.resources} />
        <FAQ dict={dict.faq} />
      </main>
      <Footer dict={dict.footer} />
    </>
  );
}
