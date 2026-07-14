import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/getDictionary';
import { getStaffData } from '@/services/staff';
import StaffClient from './StaffClient';

export default async function StaffPage({ params }: { params: Promise<{ lang: 'en' | 'pt-br' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  // Chamada para a nossa API (atualmente mockada no serviço)
  const staffData = await getStaffData();

  return (
    <>
      <NavBar dict={dict.nav} lang={lang} />
      <main style={{ paddingTop: '64px', minHeight: '100vh', position: 'relative' }}>
        <StaffClient dict={dict} staffData={staffData} />
      </main>
      <Footer dict={dict.footer} />
    </>
  );
}
