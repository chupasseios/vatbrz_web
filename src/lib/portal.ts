import type { IconName } from "@/components/Icon";
export type Lang = "pt-br" | "en";
export const t = (lang: string, pt: string, en: string) =>
  lang === "en" ? en : pt;
export const links = {
  join: "https://my.vatsim.net/register",
  account: "https://my.vatsim.net/",
  radar: "https://vatsim-radar.com/",
  charts: "https://aisweb.decea.mil.br/",
  weather: "https://redemet.decea.mil.br/",
  atc: "https://atc.vatsim.com.br/",
  community: "https://community.vatsim.net/",
  learning: "https://my.vatsim.net/learn",
  prefile: "https://my.vatsim.net/pilots/flightplan",
};
export interface Resource {
  id: string;
  title: string;
  description: string;
  provider: string;
  category: "pilot" | "atc" | "community";
  icon: IconName;
  href: string;
}
export function getResources(lang: string): Resource[] {
  return [
    {
      id: "charts",
      title: t(lang, "Cartas aeronáuticas", "Aeronautical charts"),
      description: t(
        lang,
        "Cartas, informações de aeródromos e NOTAM para preparar sua navegação.",
        "Charts, aerodrome information and NOTAMs to prepare your navigation.",
      ),
      provider: "AISWEB · DECEA",
      category: "pilot",
      icon: "map",
      href: links.charts,
    },
    {
      id: "weather",
      title: t(lang, "Meteorologia", "Aviation weather"),
      description: t(
        lang,
        "Consulte METAR, TAF e as condições meteorológicas do seu próximo destino.",
        "Check METAR, TAF and weather conditions at your next destination.",
      ),
      provider: "REDEMET · DECEA",
      category: "pilot",
      icon: "cloud",
      href: links.weather,
    },
    {
      id: "prefile",
      title: t(lang, "Enviar plano de voo", "File a flight plan"),
      description: t(
        lang,
        "Prepare e envie seu plano antes de conectar ao simulador.",
        "Prepare and file your flight plan before connecting your simulator.",
      ),
      provider: "MY VATSIM",
      category: "pilot",
      icon: "plane",
      href: links.prefile,
    },
    {
      id: "radar",
      title: t(lang, "Tráfego ao vivo", "Live traffic"),
      description: t(
        lang,
        "Encontre pilotos e posições de controle conectadas na rede.",
        "Find pilots and control positions connected to the network.",
      ),
      provider: "VATSIM RADAR",
      category: "community",
      icon: "compass",
      href: links.radar,
    },
    {
      id: "atc",
      title: t(lang, "Portal de controle", "Controller portal"),
      description: t(
        lang,
        "Manuais, softwares e procedimentos locais para os seus setores.",
        "Manuals, software and local procedures for your sectors.",
      ),
      provider: "VATBRZ · ATC",
      category: "atc",
      icon: "tower",
      href: links.atc,
    },
    {
      id: "atc-report",
      title: t(lang, "Formulário de reporte ATC", "ATC report form"),
      description: t(
        lang,
        "Avalie o serviço de controle e compartilhe sua experiência com a equipe de treinamento.",
        "Rate the ATC service and share your experience with the training team.",
      ),
      provider: "VATBRZ · FEEDBACK",
      category: "atc",
      icon: "headset",
      href: "/" + lang + "/resources/atc-report",
    },
    {
      id: "learning",
      title: t(lang, "Centro de aprendizagem", "Learning centre"),
      description: t(
        lang,
        "Conheça os fundamentos para participar da rede VATSIM.",
        "Learn the fundamentals of taking part in the VATSIM network.",
      ),
      provider: "VATSIM",
      category: "pilot",
      icon: "book",
      href: links.learning,
    },
    {
      id: "events",
      title: t(lang, "Agenda de eventos", "Events calendar"),
      description: t(
        lang,
        "Encontre o próximo encontro da comunidade nos céus do Brasil.",
        "Find the next community gathering in Brazilian skies.",
      ),
      provider: "VATBRZ",
      category: "community",
      icon: "calendar",
      href: "/" + lang + "/events",
    },
    {
      id: "community",
      title: t(lang, "Comunidade VATSIM", "VATSIM community"),
      description: t(
        lang,
        "Troque experiências e participe das conversas da rede.",
        "Share experiences and join conversations across the network.",
      ),
      provider: "VATSIM COMMUNITY",
      category: "community",
      icon: "users",
      href: links.community,
    },
    {
      id: "staff",
      title: t(lang, "Equipe e departamentos", "Team and departments"),
      description: t(
        lang,
        "Conheça a estrutura da divisão e encontre o contato certo.",
        "Explore the division structure and find the right contact.",
      ),
      provider: "VATBRZ",
      category: "community",
      icon: "headset",
      href: "/" + lang + "/staff",
    },
  ];
}
export function safeExternalUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? parsed.href : undefined;
  } catch {
    return undefined;
  }
}
