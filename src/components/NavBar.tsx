"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import Icon from "./Icon";
import ThemeToggle from "./ThemeToggle";
import UtcClock from "./UtcClock";
import { links, t } from "@/lib/portal";

export default function NavBar({ lang }: { lang: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const pages = [
    ["", t(lang, "Início", "Home")],
    ["piloto", t(lang, "Pilotos", "Pilots")],
    ["atc", "ATC"],
    ["events", t(lang, "Eventos", "Events")],
    ["resources", t(lang, "Recursos", "Resources")],
    ["staff", t(lang, "Nossa equipe", "Our team")],
  ];
  const otherLang = lang === "en" ? "pt-br" : "en";
  const otherPath = pathname.replace(/^\/(pt-br|en)(?=\/|$)/, "/" + otherLang);
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className="utility-bar">
        <div className="container utility-inner">
          <span>
            <span className="brazil-mark" aria-hidden="true" />
            VATSIM<span className="utility-divider">/</span>
            {t(lang, "DIVISÃO BRASILEIRA", "BRAZILIAN DIVISION")}
          </span>
          <div>
            <Link href={"/" + lang + "/contact"}>
              {t(lang, "Central de ajuda", "Help centre")}
            </Link>
            <span className="utility-divider">|</span>
            <UtcClock />
          </div>
        </div>
      </div>
      <div className="container nav-row">
        <Link
          href={"/" + lang}
          className="brand"
          aria-label={t(lang, "VATBRZ — início", "VATBRZ — home")}
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logos/vatbrz_logodark.svg"
            alt="VATBRZ"
            width={128}
            height={43}
            priority
          />
          <span>BRASIL</span>
        </Link>
        <nav
          className="desktop-nav"
          aria-label={t(lang, "Navegação principal", "Main navigation")}
        >
          {pages.map(([path, label]) => (
            <Link
              href={"/" + lang + (path ? "/" + path : "")}
              key={path}
              aria-current={
                pathname === "/" + lang + (path ? "/" + path : "")
                  ? "page"
                  : undefined
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <ThemeToggle lang={lang} />
          <Link
            className="language-link"
            href={otherPath}
            hrefLang={otherLang}
            lang={otherLang}
            aria-label={
              otherLang === "en" ? "Switch to English" : "Mudar para português"
            }
          >
            {otherLang === "en" ? "EN" : "PT"}
          </Link>
          <a
            className="member-button"
            href={links.account}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(lang, "Área do membro", "Member area")}
            <Icon name="external" size={14} />
          </a>
          <button
            ref={toggle}
            type="button"
            className="icon-button menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t(
              lang,
              open ? "Fechar menu" : "Abrir menu",
              open ? "Close menu" : "Open menu",
            )}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label={t(lang, "Menu principal", "Main menu")}
        >
          {pages.map(([path, label]) => (
            <Link
              key={path}
              onClick={() => setOpen(false)}
              href={"/" + lang + (path ? "/" + path : "")}
              aria-current={
                pathname === "/" + lang + (path ? "/" + path : "")
                  ? "page"
                  : undefined
              }
            >
              {label}
              <Icon name="chevron" size={16} />
            </Link>
          ))}
          <a href={links.account} target="_blank" rel="noopener noreferrer">
            {t(lang, "Área do membro", "Member area")}
            <Icon name="external" size={16} />
          </a>
        </nav>
      )}
    </header>
  );
}
