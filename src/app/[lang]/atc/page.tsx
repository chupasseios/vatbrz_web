import ComingSoon from '@/components/ComingSoon';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { getDictionary } from '@/getDictionary';

export default async function AtcPage({ params }: { params: Promise<{ lang: 'en' | 'pt-br' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = {
    ...dict.comingSoon,
    ...dict.comingSoon.atc,
  };

  return (
    <>
      <NavBar dict={dict.nav} lang={lang} />
      <ComingSoon content={content} lang={lang} />
      <Footer dict={dict.footer} />
    </>
  );
}
