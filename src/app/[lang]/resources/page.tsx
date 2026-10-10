import type { Metadata } from "next";
import ResourceDirectory from "@/components/ResourceDirectory";
import { PageHeading, HelpBanner } from "@/components/PortalUI";
import { t } from "@/lib/portal";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return { title: t(lang, "Central de recursos", "Resource centre") };
}
export default async function ResourcesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { lang } = await params;
  const { q, category } = await searchParams;
  return (
    <main id="main-content">
      <PageHeading
        lang={lang}
        label={t(lang, "Central de recursos", "Resource centre")}
        title={t(lang, "Tudo a bordo.", "Everything on board.")}
        description={t(
          lang,
          "Suas ferramentas de voo e controle, organizadas em um só lugar.",
          "Your flying and controlling tools, organised in one place.",
        )}
        icon="compass"
      />
      <div className="container page-body">
        <ResourceDirectory
          lang={lang}
          initialQuery={q || ""}
          initialCategory={category}
        />
        <HelpBanner lang={lang} />
      </div>
    </main>
  );
}
