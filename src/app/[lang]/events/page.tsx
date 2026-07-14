import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/getDictionary';
import { getBrazilianEvents } from '@/services/vatsim';
import styles from './Events.module.css';
import EventsClient from './EventsClient';

export default async function EventsPage({ params }: { params: Promise<{ lang: 'en' | 'pt-br' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const events = await getBrazilianEvents();

  return (
    <>
      <NavBar dict={dict.nav} lang={lang} />
      <main className={styles.container}>
        <EventsClient
          initialEvents={events}
          dict={dict.features}
          lang={lang}
        />
      </main>
      <Footer dict={dict.footer} />
    </>
  );
}
