import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "../globals.css";
const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://vatbrz.net"),
  title: {
    default: "VATBRZ — O Brasil na sua frequência",
    template: "%s | VATBRZ",
  },
  description:
    "A divisão brasileira da VATSIM. Recursos para pilotos e controladores, eventos e uma comunidade conectada pela aviação virtual.",
  openGraph: {
    type: "website",
    siteName: "VATBRZ",
    locale: "pt_BR",
    images: [
      {
        url: "/assets/pilot_home_v2.png",
        width: 1672,
        height: 941,
        alt: "Aviação virtual no Brasil",
      },
    ],
  },
};
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!["pt-br", "en"].includes(lang)) notFound();
  return (
    <html
      lang={lang === "pt-br" ? "pt-BR" : "en"}
      data-theme="light"
      suppressHydrationWarning
    >
      <body className={bodyFont.variable + " " + displayFont.variable}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('vatbrz-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}})()",
          }}
        />
        <a href="#main-content" className="skip-link">
          {lang === "en" ? "Skip to content" : "Pular para o conteúdo"}
        </a>
        <NavBar lang={lang} />
        {children}
        <Footer lang={lang} />
      </body>
    </html>
  );
}
