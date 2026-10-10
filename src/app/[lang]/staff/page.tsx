import { getStaffData, STAFF_DATA_IS_DEMO } from "@/services/staff";
import StaffClient from "./StaffClient";
import { PageHeading, HelpBanner } from "@/components/PortalUI";
import { t } from "@/lib/portal";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return { title: t(lang, "Nossa equipe", "Our team") };
}
export default async function StaffPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const staffData = await getStaffData();
  return (
    <main id="main-content">
      <PageHeading
        lang={lang}
        label={t(lang, "Nossa equipe", "Our team")}
        title={t(
          lang,
          "Pessoas que conectam o céu.",
          "People who connect the skies.",
        )}
        description={t(
          lang,
          "Conheça os departamentos, entenda o papel de cada área e encontre a equipe certa para ajudar.",
          "Explore our departments, understand each team and find the right people to help.",
        )}
        icon="users"
      />
      <div className="container page-body">
        <StaffClient
          staffData={staffData}
          lang={lang}
          demo={STAFF_DATA_IS_DEMO}
        />
        <HelpBanner lang={lang} />
      </div>
    </main>
  );
}
