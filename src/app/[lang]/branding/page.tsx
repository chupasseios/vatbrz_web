import Image from "next/image";
import Icon from "@/components/Icon";
import BrandPalette from "@/components/BrandPalette";
import { PageHeading, SectionHeading, HelpBanner } from "@/components/PortalUI";
import { t } from "@/lib/portal";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return { title: t(lang, "Identidade visual", "Brand assets") };
}
export default async function BrandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const logos = [
    {
      file: "vatbrz_logodark",
      label: t(lang, "Versão escura", "Dark version"),
      bg: "#eff4f7",
    },
    {
      file: "vatbrz_logowhite",
      label: t(lang, "Versão branca", "White version"),
      bg: "#050A2D",
    },
    {
      file: "vatbrz_logoblue",
      label: t(lang, "Versão azul", "Blue version"),
      bg: "#fff",
    },
  ];
  return (
    <main id="main-content">
      <PageHeading
        lang={lang}
        label={t(lang, "Identidade visual", "Brand assets")}
        title={t(
          lang,
          "Uma marca. O nosso Brasil.",
          "One identity. Our Brazil.",
        )}
        description={t(
          lang,
          "Os arquivos e as cores da VATBRZ para manter nossa comunicação consistente.",
          "VATBRZ files and colours to keep our communication consistent.",
        )}
        icon="compass"
      />
      <div className="container page-body">
        <section className="brand-showcase">
          <div className="brand-hero">
            <Image
              src="/logos/vatbrz_logowhite.svg"
              alt="VATBRZ"
              width={350}
              height={116}
              priority
            />
          </div>
          <div className="brand-story">
            <span className="eyebrow">VATBRZ · BRAND ASSETS</span>
            <h2>
              {t(
                lang,
                "O céu também é nossa assinatura.",
                "The sky is part of our signature.",
              )}
            </h2>
            <p>
              {t(
                lang,
                "Nossa marca reúne referências ao Cruzeiro do Sul e aos rastros do radar. Uma identidade que conecta a aviação virtual ao Brasil e às pessoas que fazem parte da divisão.",
                "Our mark brings together references to the Southern Cross and radar traces. An identity connecting virtual aviation to Brazil and to the people in our division.",
              )}
            </p>
          </div>
        </section>
        <section className="content-section">
          <SectionHeading
            eyebrow={t(lang, "ARQUIVOS DA MARCA", "BRAND FILES")}
            title={t(
              lang,
              "A versão certa para cada fundo.",
              "The right version for every background.",
            )}
          >
            {t(
              lang,
              "SVG para uso vetorial. PNG para uma imagem com transparência.",
              "SVG for vector use. PNG for an image with transparency.",
            )}
          </SectionHeading>
          <div className="logo-grid">
            {logos.map((logo) => (
              <article className="logo-card panel" key={logo.file}>
                <div className="logo-preview" style={{ background: logo.bg }}>
                  <Image
                    src={"/logos/" + logo.file + ".svg"}
                    alt={logo.label}
                    width={210}
                    height={70}
                  />
                </div>
                <div className="logo-card-info">
                  <h3>{logo.label}</h3>
                  <div className="logo-downloads">
                    {["svg", "png"].map((ext) => (
                      <a
                        key={ext}
                        href={"/logos/" + logo.file + "." + ext}
                        download
                      >
                        <Icon name="download" size={14} />
                        {ext.toUpperCase()}
                        <span className="sr-only"> — {logo.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="content-section">
          <SectionHeading
            eyebrow={t(lang, "PALETA DA MARCA", "BRAND PALETTE")}
            title={t(
              lang,
              "As cores que nos representam.",
              "The colours that represent us.",
            )}
          >
            {t(
              lang,
              "Clique no código para copiar a cor.",
              "Click a code to copy the colour.",
            )}
          </SectionHeading>
          <BrandPalette lang={lang} />
        </section>
        <section className="content-section">
          <SectionHeading
            title={t(
              lang,
              "Cuidados que fazem a diferença.",
              "Small details make a difference.",
            )}
          />
          <div className="brand-guidelines">
            {[
              [
                t(lang, "Preserve a proporção", "Preserve proportions"),
                t(
                  lang,
                  "Redimensione a marca sem esticar, inclinar ou alterar os elementos do arquivo.",
                  "Resize the mark without stretching, tilting or changing its elements.",
                ),
              ],
              [
                t(lang, "Dê espaço à marca", "Give the mark space"),
                t(
                  lang,
                  "Mantenha uma área livre ao redor para que ela continue legível em qualquer aplicação.",
                  "Leave a clear area around the mark to keep it legible in every application.",
                ),
              ],
              [
                t(lang, "Escolha o contraste", "Choose contrast"),
                t(
                  lang,
                  "Prefira a versão branca em fundos escuros e as versões azul ou escura em fundos claros.",
                  "Use the white version on dark backgrounds and blue or dark versions on light backgrounds.",
                ),
              ],
            ].map(([title, text]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>
        <HelpBanner lang={lang} />
      </div>
    </main>
  );
}
