import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import Script from "next/script";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });
const caveat = Caveat({ subsets: ["latin"], weight: '400', variable: '--font-caveat' });

export const metadata: Metadata = {
  title: {
    default: 'VATBRZ — Rede VATSIM Brasil',
    template: '%s | VATBRZ',
  },
  description: 'A maior rede de simulação de voo do Brasil. Junte-se à comunidade VATSIM Brasil e voe com controle aéreo real.',
  keywords: ['VATSIM', 'VATBRZ', 'simulação de voo', 'piloto virtual', 'controle aéreo', 'Brasil', 'flight simulation'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://vatbrz.net',
    siteName: 'VATBRZ',
    title: 'VATBRZ — Rede VATSIM Brasil',
    description: 'A maior rede de simulação de voo do Brasil. Junte-se à comunidade VATSIM Brasil e voe com controle aéreo real.',
    images: [
      {
        url: '/assets/banner_mocape.png',
        width: 1920,
        height: 1080,
        alt: 'VATBRZ — Rede VATSIM Brasil',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VATBRZ — Rede VATSIM Brasil',
    description: 'A maior rede de simulação de voo do Brasil.',
    images: ['/assets/banner_mocape.png'],
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  return (
    <html lang={lang} data-theme="dark" suppressHydrationWarning>
      <body className={`${inter.className} ${caveat.variable}`}>
        <Script id="vatbrz-theme" strategy="beforeInteractive">
          {`(function(){try{var saved=localStorage.getItem('vatbrz-theme');var theme=saved||(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=theme}catch(e){}})()`}
        </Script>
        <div className="grid-bg-container">
          <div className="grid-bg"></div>
          <div className="radial-gradient-bg"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
