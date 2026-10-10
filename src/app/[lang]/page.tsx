import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import NetworkPanel from "@/components/NetworkPanel";
import { ActionLink, SectionHeading } from "@/components/PortalUI";
import { links, t, getResources } from "@/lib/portal";
import { getDictionary } from "@/getDictionary";
export default async function Home({
  params,
}: {
  params: Promise<{ lang: "pt-br" | "en" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const shortcuts = getResources(lang).filter((r) =>
    ["charts", "weather", "prefile", "atc"].includes(r.id),
  );
  return (
    <main id="main-content">
      <section className="home-hero">
        <div className="hero-photo">
          <Image
            src="/assets/pilot_home_v2.png"
            alt={t(
              lang,
              "Vista do cockpit alinhado à pista em um simulador de voo",
              "Cockpit view lined up with the runway in a flight simulator",
            )}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 65vw"
          />
          <div className="photo-caption">
            <span className="caption-line" />
            {t(
              lang,
              "DA SUA CABINE PARA O MUNDO",
              "FROM YOUR COCKPIT TO THE WORLD",
            )}
            <span className="mono">BRZ / VATSIM</span>
          </div>
        </div>
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow light">
              <span className="brazil-mark" />
              {t(lang, "BEM-VINDO À VATSIM BRASIL", "WELCOME TO VATSIM BRAZIL")}
            </span>
            <h1>
              {t(lang, "O Brasil na sua", "Brazil on your")}
              <br />
              <em>{t(lang, "frequência.", "frequency.")}</em>
            </h1>
            <p>
              {t(
                lang,
                "Cada voo, uma nova conexão. Pilotos e controladores unidos para dar vida ao espaço aéreo brasileiro.",
                "Every flight, a new connection. Pilots and controllers bringing Brazilian airspace to life.",
              )}
            </p>
            <div className="hero-actions">
              <ActionLink href={"/" + lang + "/piloto"}>
                {t(lang, "Prepare seu próximo voo", "Prepare your next flight")}
              </ActionLink>
              <Link className="hero-text-link" href={"/" + lang + "/atc"}>
                {t(lang, "Quero ser controlador", "Become a controller")}
                <Icon name="arrow" size={17} />
              </Link>
            </div>
            <div className="hero-footnote">
              <span className="mini-runway" aria-hidden="true" />
              <span>
                {t(
                  lang,
                  "AVIAÇÃO VIRTUAL. CONEXÕES REAIS.",
                  "VIRTUAL AVIATION. REAL CONNECTIONS.",
                )}
              </span>
            </div>
          </div>
        </div>
      </section>
      <section
        className="quick-access container"
        aria-label={t(lang, "Acesso rápido", "Quick access")}
      >
        <div className="quick-label">
          <Icon name="compass" size={20} />
          <span>
            {t(lang, "PRONTO PARA", "READY TO")}
            <strong>{t(lang, "decolar?", "take off?")}</strong>
          </span>
        </div>
        {shortcuts.map((r) => (
          <a key={r.id} href={r.href} target="_blank" rel="noopener noreferrer">
            <Icon name={r.icon} size={23} />
            <span>
              <strong>{r.title}</strong>
              <small>{r.provider}</small>
            </span>
            <Icon name="external" size={14} />
          </a>
        ))}
      </section>
      <div className="container main-sections">
        <section className="start-section">
          <SectionHeading
            eyebrow={t(lang, "SEU LUGAR NA REDE", "YOUR PLACE IN THE NETWORK")}
            title={t(
              lang,
              "O mesmo céu. A sua escolha.",
              "One sky. Your choice.",
            )}
            action={
              <Link className="text-link" href={"/" + lang + "/resources"}>
                {t(lang, "Todos os recursos", "All resources")}
                <Icon name="arrow" size={17} />
              </Link>
            }
          >
            {t(
              lang,
              "Do primeiro contato à próxima etapa da sua jornada.",
              "From your first radio call to the next stage of your journey.",
            )}
          </SectionHeading>
          <div className="journey-grid">
            <Link
              className="journey-card pilot-card"
              href={"/" + lang + "/piloto"}
            >
              <div className="journey-copy">
                <span className="eyebrow">
                  {t(lang, "PARA PILOTOS", "FOR PILOTS")}
                </span>
                <h3>
                  {t(lang, "O próximo destino", "Your next destination")}
                  <br />
                  {t(lang, "começa aqui.", "starts here.")}
                </h3>
                <p>
                  {t(
                    lang,
                    "Planejamento, ferramentas e orientação para voar com confiança.",
                    "Planning, tools and guidance to fly with confidence.",
                  )}
                </p>
                <span className="text-link">
                  {t(lang, "Explorar área do piloto", "Explore the pilot hub")}
                  <Icon name="arrow" size={19} />
                </span>
              </div>
              <div className="journey-visual">
                <Image
                  src="/assets/pilot_home_v2.png"
                  alt=""
                  fill
                  sizes="(max-width: 760px) 50vw, 25vw"
                />
                <span className="visual-tag">
                  <Icon name="plane" size={16} />
                  PILOT BRIEFING
                </span>
              </div>
            </Link>
            <Link className="journey-card atc-card" href={"/" + lang + "/atc"}>
              <div className="journey-copy">
                <span className="eyebrow">
                  {t(lang, "PARA CONTROLADORES", "FOR CONTROLLERS")}
                </span>
                <h3>
                  {t(lang, "Sua voz conecta", "Your voice connects")}
                  <br />
                  {t(lang, "o Brasil.", "Brazil.")}
                </h3>
                <p>
                  {t(
                    lang,
                    "Treinamento, procedimentos e tudo para assumir a frequência.",
                    "Training, procedures and everything to take the frequency.",
                  )}
                </p>
                <span className="text-link">
                  {t(lang, "Explorar área ATC", "Explore the ATC hub")}
                  <Icon name="arrow" size={19} />
                </span>
              </div>
              <div className="journey-visual">
                <Image
                  src="/assets/atc_home.png"
                  alt=""
                  fill
                  sizes="(max-width: 760px) 50vw, 25vw"
                />
                <span className="visual-tag">
                  <Icon name="tower" size={16} />
                  ATC OPERATIONS
                </span>
              </div>
            </Link>
          </div>
        </section>
        <NetworkPanel lang={lang} />
        <section className="community-grid">
          <div className="community-feature">
            <span className="eyebrow">
              {t(lang, "ALÉM DO PLANO DE VOO", "BEYOND THE FLIGHT PLAN")}
            </span>
            <h2>
              {t(lang, "O melhor da aviação", "The best of aviation")}
              <br />
              {t(lang, "é viver junto.", "is sharing it.")}
            </h2>
            <p>
              {t(
                lang,
                "Uma chegada movimentada, uma nova amizade, aquele primeiro pouso com controle. Encontre a comunidade no próximo evento.",
                "A busy arrival, a new friendship, that first landing with ATC. Meet the community at the next event.",
              )}
            </p>
            <ActionLink href={"/" + lang + "/events"}>
              {t(
                lang,
                "Explorar agenda de eventos",
                "Explore the events calendar",
              )}
            </ActionLink>
            <div className="event-strip">
              <span className="mono">DEP</span>
              <span className="route-line" />
              <Icon name="plane" size={23} />
              <span className="route-line" />
              <span className="mono">ARR</span>
            </div>
          </div>
          <div className="welcome-panel">
            <span className="icon-box">
              <Icon name="headset" size={26} />
            </span>
            <h3>{t(lang, "Primeira vez por aqui?", "First time here?")}</h3>
            <p>
              {t(
                lang,
                "Você não precisa saber tudo para começar. Conheça a rede e descubra como preparar sua primeira conexão.",
                "You do not need to know everything to get started. Discover the network and prepare your first connection.",
              )}
            </p>
            <Link
              href={"/" + lang + "/piloto#primeiros-passos"}
              className="list-link"
            >
              {t(lang, "Como começar a voar", "How to start flying")}
              <Icon name="arrow" size={18} />
            </Link>
            <Link
              href={"/" + lang + "/atc#primeiros-passos"}
              className="list-link"
            >
              {t(lang, "Como começar a controlar", "How to start controlling")}
              <Icon name="arrow" size={18} />
            </Link>
            <a
              href={links.community}
              target="_blank"
              rel="noopener noreferrer"
              className="list-link"
            >
              {t(lang, "Conhecer a comunidade", "Meet the community")}
              <Icon name="external" size={16} />
            </a>
          </div>
        </section>
        <section className="faq-section" id="faq">
          <div>
            <span className="eyebrow">
              {t(lang, "ANTES DO PRIMEIRO VOO", "BEFORE YOUR FIRST FLIGHT")}
            </span>
            <h2>{t(lang, "Pode perguntar.", "Ask away.")}</h2>
            <p>
              {t(
                lang,
                "Algumas respostas para você começar com tranquilidade.",
                "A few answers to help you get started.",
              )}
            </p>
            <Link className="text-link" href={"/" + lang + "/contact"}>
              {t(lang, "Ainda preciso de ajuda", "I still need help")}
              <Icon name="arrow" size={17} />
            </Link>
          </div>
          <div className="faq-list">
            {[
              [dict.faq.q1, dict.faq.a1],
              [
                t(
                  lang,
                  "Preciso pagar para participar?",
                  "Do I need to pay to join?",
                ),
                t(
                  lang,
                  "A participação na VATSIM é gratuita. Você precisa de um simulador compatível e de um cliente de conexão; alguns simuladores e complementos são pagos.",
                  "VATSIM membership is free. You need a compatible simulator and a connection client; some simulators and add-ons are paid.",
                ),
              ],
              [dict.faq.q3, dict.faq.a3],
              [
                t(
                  lang,
                  "Onde encontro os materiais de treinamento?",
                  "Where can I find training materials?",
                ),
                t(
                  lang,
                  "Na área de Pilotos você encontra os primeiros passos. Para controle, a área ATC reúne o acesso ao portal de manuais e treinamento da divisão.",
                  "The Pilots section covers your first steps. For controlling, the ATC hub links to the division’s manuals and training portal.",
                ),
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
