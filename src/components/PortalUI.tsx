import Link from "next/link";
import Icon, { type IconName } from "./Icon";
import { t } from "@/lib/portal";

export function ActionLink({
  href,
  children,
  secondary = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  const external = href.startsWith("https://");
  return (
    <Link
      className={"button " + (secondary ? "button-secondary " : "") + className}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
      <Icon name={external ? "external" : "arrow"} size={17} />
    </Link>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {children && <p>{children}</p>}
      </div>
      {action}
    </div>
  );
}
export function PageHeading({
  lang,
  label,
  title,
  description,
  icon,
}: {
  lang: string;
  label: string;
  title: string;
  description: string;
  icon: IconName;
}) {
  return (
    <header className="page-heading">
      <div className="container">
        <div className="breadcrumb">
          <Link href={"/" + lang}>{t(lang, "Início", "Home")}</Link>
          <Icon name="chevron" size={13} />
          <span>{label}</span>
        </div>
        <div className="page-heading-row">
          <div>
            <span className="eyebrow">{label}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="page-emblem">
            <Icon name={icon} size={50} />
          </div>
        </div>
      </div>
    </header>
  );
}
export function HelpBanner({ lang }: { lang: string }) {
  return (
    <aside className="help-banner">
      <div className="icon-box">
        <Icon name="headset" size={25} />
      </div>
      <div>
        <h3>
          {t(lang, "Precisa de uma orientação?", "Need a little guidance?")}
        </h3>
        <p>
          {t(
            lang,
            "A gente ajuda você a encontrar o próximo passo.",
            "We can help you find your next step.",
          )}
        </p>
      </div>
      <ActionLink href={"/" + lang + "/contact"} secondary>
        {t(lang, "Fale com a equipe", "Talk to the team")}
      </ActionLink>
    </aside>
  );
}
