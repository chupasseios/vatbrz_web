import CareerPage from "@/components/CareerPage";
import { t } from "@/lib/portal";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return { title: t(lang, "Área do controlador", "Controller hub") };
}
export default async function AtcPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <CareerPage lang={lang} atc />;
}
