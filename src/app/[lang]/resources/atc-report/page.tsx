import type { Metadata } from "next";
import { PageHeading } from "@/components/PortalUI";
import AtcReportForm from "@/components/AtcReportForm";
import { t } from "@/lib/portal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return { title: t(lang, "Reporte ATC", "ATC report") };
}

export default async function AtcReportPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <main id="main-content">
      <PageHeading
        lang={lang}
        label={t(lang, "Recursos / Reporte ATC", "Resources / ATC report")}
        title={t(
          lang,
          "Sua experiência faz a diferença.",
          "Your experience makes a difference.",
        )}
        description={t(
          lang,
          "Reconheça um bom atendimento ou conte o que pode melhorar. Seu feedback contribui para a formação dos nossos controladores.",
          "Recognise great service or tell us what could improve. Your feedback helps train our controllers.",
        )}
        icon="headset"
      />
      <div className="container page-body">
        <AtcReportForm lang={lang} />
      </div>
    </main>
  );
}
