import Icon, { type IconName } from "@/components/Icon";
import { ActionLink, PageHeading } from "@/components/PortalUI";
import { links, t } from "@/lib/portal";
import { getDictionary } from "@/getDictionary";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return { title: t(lang, "Fale conosco", "Contact us") };
}
export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: "pt-br" | "en" }>;
}) {
  const { lang } = await params;
  const { contact } = await getDictionary(lang);
  const departments: {
    label: string;
    email: string;
    description: string;
    icon: IconName;
  }[] = [
    {
      label: t(lang, "Atendimento ao membro", "Member support"),
      email: contact.supportEmail,
      description: t(
        lang,
        "Dúvidas gerais, orientação e ajuda para encontrar o caminho.",
        "General questions, guidance and help finding your way.",
      ),
      icon: "headset",
    },
    {
      label: t(lang, "Treinamento", "Training"),
      email: contact.trainingEmail,
      description: t(
        lang,
        "Primeiros passos, formação e desenvolvimento na rede.",
        "First steps, training and development in the network.",
      ),
      icon: "book",
    },
    {
      label: t(lang, "Operações", "Operations"),
      email: contact.opsEmail,
      description: t(
        lang,
        "Procedimentos locais e operação no espaço aéreo brasileiro.",
        "Local procedures and Brazilian airspace operations.",
      ),
      icon: "tower",
    },
    {
      label: t(lang, "Diretoria", "Leadership"),
      email: contact.directorEmail,
      description: t(
        lang,
        "Assuntos institucionais, sugestões e contato com a direção.",
        "Institutional matters, suggestions and leadership contact.",
      ),
      icon: "users",
    },
  ];
  return (
    <main id="main-content">
      <PageHeading
        lang={lang}
        label={t(lang, "Central de ajuda", "Help centre")}
        title={t(lang, "Vamos conversar.", "Let’s talk.")}
        description={t(
          lang,
          "Uma dúvida, uma ideia ou uma ajuda para começar. Encontre o canal certo para falar com a gente.",
          "A question, an idea or some help getting started. Find the right way to reach us.",
        )}
        icon="headset"
      />
      <div className="container page-body">
        <div className="contact-grid">
          <aside className="contact-feature">
            <span className="icon-box">
              <Icon name="users" size={28} />
            </span>
            <h2>
              {t(
                lang,
                "A conversa também faz parte do voo.",
                "Conversation is part of the flight.",
              )}
            </h2>
            <p>
              {t(
                lang,
                "Na comunidade VATSIM, você encontra outros membros para trocar experiências, compartilhar descobertas e aprender junto.",
                "Find other members in the VATSIM community to share experiences, discoveries and learn together.",
              )}
            </p>
            <ActionLink href={links.community}>
              {t(lang, "Acessar a comunidade", "Open the community")}
            </ActionLink>
            <small>
              {t(
                lang,
                "Para assuntos com a divisão, use o contato do departamento ao lado.",
                "For division matters, use the department contacts listed here.",
              )}
            </small>
          </aside>
          <div className="contact-cards">
            {departments.map((d) => (
              <article className="contact-card panel" key={d.email}>
                <span className="icon-box">
                  <Icon name={d.icon} />
                </span>
                <h3>{d.label}</h3>
                <p>{d.description}</p>
                <a href={"mailto:" + d.email}>
                  {d.email}
                  <Icon name="external" size={13} />
                </a>
              </article>
            ))}
          </div>
        </div>
        <div className="help-banner">
          <span className="icon-box">
            <Icon name="mail" />
          </span>
          <div>
            <h3>
              {t(
                lang,
                "Ajude a equipe a entender seu pedido.",
                "Help the team understand your request.",
              )}
            </h3>
            <p>
              {t(
                lang,
                "Ao escrever, inclua seu nome, CID e uma descrição do assunto. Nunca envie senhas.",
                "When writing, include your name, CID and a description of the issue. Never send passwords.",
              )}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
