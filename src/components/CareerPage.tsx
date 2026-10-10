import Image from "next/image";
import Link from "next/link";
import FlightChecklist from "./FlightChecklist";
import Icon from "./Icon";
import {
  ActionLink,
  PageHeading,
  SectionHeading,
  HelpBanner,
} from "./PortalUI";
import { links, t, getResources } from "@/lib/portal";

export default function CareerPage({
  lang,
  atc = false,
}: {
  lang: string;
  atc?: boolean;
}) {
  const resources = getResources(lang).filter((r) =>
    atc
      ? ["atc", "charts", "weather"].includes(r.id)
      : ["charts", "weather", "prefile"].includes(r.id),
  );
  const steps = atc
    ? [
        [
          t(lang, "Conheça o caminho", "Explore the path"),
          t(
            lang,
            "Entenda como funciona a formação de controladores na divisão.",
            "Understand how controller training works in the division.",
          ),
          links.atc,
        ],
        [
          t(lang, "Prepare suas ferramentas", "Prepare your tools"),
          t(
            lang,
            "Consulte os guias de instalação e os materiais de estudo do Portal ATC.",
            "Browse installation guides and study materials in the ATC Portal.",
          ),
          links.atc,
        ],
        [
          t(lang, "Converse com a instrução", "Talk to the training team"),
          t(
            lang,
            "Busque orientação sobre ingresso, requisitos e próximas etapas.",
            "Ask about joining, requirements and your next steps.",
          ),
          "/" + lang + "/contact",
        ],
      ]
    : [
        [
          t(lang, "Crie sua conta", "Create your account"),
          t(
            lang,
            "Cadastre-se na VATSIM e conheça as orientações para novos membros.",
            "Register with VATSIM and read the guidance for new members.",
          ),
          links.join,
        ],
        [
          t(lang, "Prepare o simulador", "Prepare your simulator"),
          t(
            lang,
            "Escolha um cliente compatível e confira os materiais de introdução.",
            "Choose a compatible connection client and review introductory materials.",
          ),
          links.learning,
        ],
        [
          t(lang, "Planeje um voo simples", "Plan a simple flight"),
          t(
            lang,
            "Use uma aeronave conhecida, consulte as cartas e prepare sua comunicação.",
            "Use a familiar aircraft, review the charts and prepare your radio calls.",
          ),
          "/" + lang + "/resources",
        ],
      ];
  return (
    <main id="main-content">
      <PageHeading
        lang={lang}
        label={t(
          lang,
          atc ? "Área do controlador" : "Área do piloto",
          atc ? "Controller hub" : "Pilot hub",
        )}
        title={t(
          lang,
          atc
            ? "Na frequência. No controle."
            : "Seu próximo voo começa no solo.",
          atc
            ? "On frequency. In control."
            : "Your next flight starts on the ground.",
        )}
        description={t(
          lang,
          atc
            ? "Materiais, orientação e ferramentas para conectar o espaço aéreo brasileiro."
            : "Prepare a rota, confira as condições e encontre tudo para voar na rede.",
          atc
            ? "Guidance, materials and tools to connect Brazilian airspace."
            : "Plan your route, check conditions and find everything you need to fly online.",
        )}
        icon={atc ? "tower" : "plane"}
      />
      <div className="container page-body">
        <div className="career-intro">
          <div className="career-photo">
            <Image
              src={atc ? "/assets/atc_home.png" : "/assets/pilot_home_v2.png"}
              alt={t(
                lang,
                atc
                  ? "Estação de controle de tráfego aéreo virtual"
                  : "Cockpit de um simulador de voo",
                atc
                  ? "Virtual air traffic control station"
                  : "Flight simulator cockpit",
              )}
              fill
              priority
              sizes="(max-width: 800px) 100vw, 55vw"
            />
            <div>
              <span className="eyebrow light">
                {atc ? "ATC OPERATIONS" : "PILOT BRIEFING"}
              </span>
              <h2>
                {t(
                  lang,
                  atc
                    ? "Cada instrução faz a diferença."
                    : "A melhor parte está por vir.",
                  atc
                    ? "Every instruction makes a difference."
                    : "The best part is still ahead.",
                )}
              </h2>
              <ActionLink href={atc ? links.atc : links.prefile}>
                {t(
                  lang,
                  atc ? "Acessar Portal ATC" : "Enviar plano de voo",
                  atc ? "Open ATC Portal" : "File a flight plan",
                )}
              </ActionLink>
            </div>
          </div>
          <FlightChecklist lang={lang} atc={atc} />
        </div>
        <section className="content-section">
          <SectionHeading
            eyebrow={t(lang, "À MÃO", "WITHIN REACH")}
            title={t(
              lang,
              "Ferramentas da sua operação.",
              "Tools for your operation.",
            )}
            action={
              <Link href={"/" + lang + "/resources"} className="text-link">
                {t(lang, "Ver todos", "View all")}
                <Icon name="arrow" size={16} />
              </Link>
            }
          />
          <div className="resource-grid">
            {resources.map((resource) => (
              <a
                className="resource-card"
                href={resource.href}
                key={resource.id}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="card-top">
                  <span className="icon-box">
                    <Icon name={resource.icon} />
                  </span>
                  <Icon name="external" size={16} />
                </div>
                <span className="eyebrow">{resource.provider}</span>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
              </a>
            ))}
          </div>
        </section>
        <section className="content-section" id="primeiros-passos">
          <SectionHeading
            eyebrow={t(lang, "PRIMEIROS PASSOS", "FIRST STEPS")}
            title={t(
              lang,
              atc
                ? "Sua jornada até a frequência."
                : "Seu primeiro voo na rede.",
              atc
                ? "Your path to the frequency."
                : "Your first flight on the network.",
            )}
          />
          <div className="steps-grid">
            {steps.map(([title, description, href], index) => (
              <article className="step-card" key={title}>
                <span className="step-number">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <Link
                  className="text-link"
                  href={href}
                  target={href.startsWith("https") ? "_blank" : undefined}
                  rel={
                    href.startsWith("https") ? "noopener noreferrer" : undefined
                  }
                >
                  {t(lang, "Saiba mais", "Learn more")}
                  <Icon name="arrow" size={16} />
                </Link>
              </article>
            ))}
          </div>
        </section>
        {atc && (
          <section className="operations-note panel">
            <Icon name="tower" size={29} />
            <div>
              <h3>
                {t(
                  lang,
                  "Procedimentos sempre à mão.",
                  "Keep procedures close.",
                )}
              </h3>
              <p>
                {t(
                  lang,
                  "O Portal ATC reúne as referências de aeródromos, terminais, centros e operação oceânica. Confira sempre a publicação aplicável à sua posição.",
                  "The ATC Portal brings together aerodrome, terminal, centre and oceanic references. Always check the publication applicable to your position.",
                )}
              </p>
            </div>
            <ActionLink href={links.atc} secondary>
              {t(lang, "Consultar manuais", "Browse manuals")}
            </ActionLink>
          </section>
        )}
        <HelpBanner lang={lang} />
      </div>
    </main>
  );
}
