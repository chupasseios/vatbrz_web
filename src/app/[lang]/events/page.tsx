import { getBrazilianEventsResult } from "@/services/vatsim";
import EventsClient from "./EventsClient";
import { PageHeading, HelpBanner } from "@/components/PortalUI";
import { t } from "@/lib/portal";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return { title: t(lang, "Agenda de eventos", "Events calendar") };
}
export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const result = await getBrazilianEventsResult();
  return (
    <main id="main-content">
      <PageHeading
        lang={lang}
        label={t(lang, "Agenda de eventos", "Events calendar")}
        title={t(
          lang,
          "Marque o próximo encontro.",
          "Make time for the next flight.",
        )}
        description={t(
          lang,
          "Rotas especiais, aeroportos movimentados e a comunidade reunida na mesma frequência.",
          "Special routes, busy airports and the community together on the same frequency.",
        )}
        icon="calendar"
      />
      <div className="container page-body">
        <EventsClient
          initialEvents={result.events}
          unavailable={result.unavailable}
          lang={lang}
          referenceTime={result.referenceTime}
        />
        <HelpBanner lang={lang} />
      </div>
    </main>
  );
}
