import Image from "next/image";
import Link from "next/link";
import { links, t } from "@/lib/portal";
import Icon from "./Icon";
export default function Footer({ lang }: { lang: string }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Image
              src="/logos/vatbrz_logowhite.svg"
              alt="VATBRZ"
              width={142}
              height={48}
            />
            <p>
              {t(
                lang,
                "Um país inteiro. A mesma paixão por voar.",
                "An entire country. A shared passion for flight.",
              )}
            </p>
            <span className="eyebrow">VATSIM · SOUTH AMERICA</span>
          </div>
          <div>
            <h3>{t(lang, "Seu próximo passo", "Your next step")}</h3>
            <Link href={"/" + lang + "/piloto"}>
              {t(lang, "Quero voar", "I want to fly")}
            </Link>
            <Link href={"/" + lang + "/atc"}>
              {t(lang, "Quero controlar", "I want to control")}
            </Link>
            <Link href={"/" + lang + "/events"}>
              {t(lang, "Participar de eventos", "Join an event")}
            </Link>
          </div>
          <div>
            <h3>{t(lang, "A divisão", "The division")}</h3>
            <Link href={"/" + lang + "/staff"}>
              {t(lang, "Nossa equipe", "Our team")}
            </Link>
            <Link href={"/" + lang + "/branding"}>
              {t(lang, "Identidade visual", "Brand assets")}
            </Link>
            <Link href={"/" + lang + "/contact"}>
              {t(lang, "Fale conosco", "Contact us")}
            </Link>
          </div>
          <div>
            <h3>{t(lang, "Conecte-se", "Stay connected")}</h3>
            <a href={links.community} target="_blank" rel="noopener noreferrer">
              {t(lang, "Comunidade VATSIM", "VATSIM community")}
              <Icon name="external" size={13} />
            </a>
            <a
              href="https://www.instagram.com/vatsimbrasil"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
              <Icon name="external" size={13} />
            </a>
            <a
              href="https://www.youtube.com/@VATSIMBrasil"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
              <Icon name="external" size={13} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} VATBRZ</span>
          <p>
            {t(
              lang,
              "Destinado exclusivamente à simulação de voo na rede VATSIM. Não utilizar para navegação aérea real.",
              "Exclusively for flight simulation on VATSIM. Not for real-world navigation.",
            )}
          </p>
          <span className="footer-signoff">
            BRZ
            <span className="brazil-mark" aria-hidden="true" />
          </span>
        </div>
      </div>
    </footer>
  );
}
