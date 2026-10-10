"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import { t } from "@/lib/portal";
import type { StaffDepartment, StaffMember } from "@/services/staff";
const labels: Record<string, [string, string, string, string]> = {
  diretoria: [
    "Diretoria",
    "Leadership",
    "Planejamento e coordenação da divisão.",
    "Planning and division coordination.",
  ],
  tecnologia: [
    "Tecnologia",
    "Technology",
    "Ferramentas e serviços para a comunidade.",
    "Tools and services for the community.",
  ],
  operacoes: [
    "Operações",
    "Operations",
    "Procedimentos e organização do espaço aéreo virtual.",
    "Virtual airspace procedures and organisation.",
  ],
  instrucao: [
    "Instrução",
    "Training",
    "Formação e desenvolvimento de pilotos e controladores.",
    "Training and development for pilots and controllers.",
  ],
  marketing: [
    "Comunicação",
    "Communications",
    "A identidade e a voz da nossa comunidade.",
    "Our community identity and voice.",
  ],
  eventos: [
    "Eventos",
    "Events",
    "Encontros que conectam pilotos e controladores.",
    "Gatherings that connect pilots and controllers.",
  ],
  membros: [
    "Membros",
    "Membership",
    "Acolhimento e apoio à comunidade.",
    "Welcoming and supporting the community.",
  ],
};
const roles: Record<string, string> = {
  Diretor: "Director",
  "Vice Diretor": "Deputy director",
  Gerente: "Manager",
  "Vice Gerente": "Deputy manager",
  Assistente: "Assistant",
  Líder: "Lead",
  "Vice Líder": "Deputy lead",
  Examinador: "Examiner",
  Mentor: "Mentor",
};
export default function StaffClient({
  staffData,
  lang,
  demo = false,
}: {
  staffData: StaffDepartment[];
  lang: string;
  demo?: boolean;
}) {
  const [department, setDepartment] = useState("all");
  const [query, setQuery] = useState("");
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const memberMatches = (m: StaffMember) =>
    normalize(m.name + " " + m.role + " " + (roles[m.role] || "")).includes(
      normalize(query),
    );
  const count = (d: StaffDepartment) =>
    d.members.length +
    (d.subDepartments?.reduce((n, s) => n + s.members.length, 0) || 0);
  const departments = staffData.filter(
    (d) =>
      (department === "all" || department === d.id) &&
      (d.members.some(memberMatches) ||
        d.subDepartments?.some((s) => s.members.some(memberMatches)) ||
        normalize(labels[d.id]?.join(" ") || d.name).includes(
          normalize(query),
        )),
  );
  const slots = staffData.reduce((n, d) => n + count(d), 0);
  const card = (m: StaffMember) => (
    <article
      className={"staff-card " + (m.vacant ? "staff-vacant" : "")}
      key={m.id}
    >
      <div className="staff-avatar">
        {m.photoUrl && !m.vacant ? (
          <Image
            src={m.photoUrl}
            alt=""
            fill
            sizes="54px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <Icon name={m.vacant ? "users" : "headset"} size={23} />
        )}
      </div>
      <div>
        <span className="eyebrow">
          {lang === "en" ? roles[m.role] || m.role : m.role}
        </span>
        <h3>
          {!demo && !m.vacant
            ? m.name
            : t(
                lang,
                m.vacant ? "Posição a preencher" : "Responsável a confirmar",
                m.vacant ? "Position to be filled" : "Lead to be confirmed",
              )}
        </h3>
        {demo && <p>{t(lang, "Modelo de apresentação", "Display template")}</p>}
      </div>
    </article>
  );
  return (
    <>
      {demo && (
        <div className="notice">
          <Icon name="users" size={17} />
          <p>
            {t(
              lang,
              "Prévia da estrutura da equipe. Os cargos abaixo são demonstrativos; nomes e vagas precisam ser confirmados pela divisão.",
              "Team structure preview. Positions below are illustrative; names and vacancies must be confirmed by the division.",
            )}
          </p>
        </div>
      )}
      <div className="staff-layout">
        <aside
          className="staff-sidebar"
          aria-label={t(
            lang,
            "Filtrar por departamento",
            "Filter by department",
          )}
        >
          <span className="eyebrow">
            {t(lang, "DEPARTAMENTOS", "DEPARTMENTS")}
          </span>
          <button
            aria-pressed={department === "all"}
            onClick={() => setDepartment("all")}
          >
            {t(lang, "Toda a equipe", "All departments")}
            <span>{staffData.length}</span>
          </button>
          {staffData.map((d) => (
            <button
              key={d.id}
              aria-pressed={department === d.id}
              onClick={() => setDepartment(d.id)}
            >
              {labels[d.id]?.[lang === "en" ? 1 : 0] || d.name}
              <span>{count(d)}</span>
            </button>
          ))}
          <div className="sidebar-help">
            <p>
              {t(lang, "Não sabe com quem falar?", "Not sure who to contact?")}
            </p>
            <Link href={"/" + lang + "/contact"}>
              {t(lang, "Encontre o contato certo", "Find the right contact")} →
            </Link>
          </div>
        </aside>
        <div>
          <div className="staff-metrics">
            <div>
              <strong>{staffData.length}</strong>
              <span>{t(lang, "departamentos", "departments")}</span>
            </div>
            <div>
              <strong>{slots}</strong>
              <span>
                {t(
                  lang,
                  demo ? "posições no modelo" : "posições",
                  demo ? "template positions" : "positions",
                )}
              </span>
            </div>
            <div>
              <Icon name="users" size={26} />
              <span>
                {t(
                  lang,
                  "Uma comunidade de voluntários",
                  "A volunteer community",
                )}
              </span>
            </div>
          </div>
          <label className="search-input">
            <Icon name="search" />
            <span className="sr-only">
              {t(lang, "Buscar equipe", "Search team")}
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(
                lang,
                "Buscar cargo ou departamento…",
                "Search role or department…",
              )}
            />
          </label>
          <p className="result-count" role="status" style={{ marginTop: 12 }}>
            {departments.length}{" "}
            {t(lang, "departamentos encontrados", "departments found")}
          </p>
          {departments.map((d) => {
            const all = normalize(labels[d.id]?.join(" ") || d.name).includes(
              normalize(query),
            );
            return (
              <section key={d.id} className="staff-section">
                <div className="department-heading">
                  <h2>{labels[d.id]?.[lang === "en" ? 1 : 0] || d.name}</h2>
                  <span>
                    {count(d)}{" "}
                    {t(
                      lang,
                      demo ? "posições no modelo" : "posições",
                      demo ? "template positions" : "positions",
                    )}
                  </span>
                </div>
                <p>{labels[d.id]?.[lang === "en" ? 3 : 2]}</p>
                <div className="staff-grid">
                  {d.members.filter((m) => all || memberMatches(m)).map(card)}
                </div>
                {d.subDepartments?.map((s) => {
                  const members = s.members.filter(
                    (m) => all || memberMatches(m),
                  );
                  return members.length > 0 ? (
                    <div className="subdepartment" key={s.id}>
                      <h3>
                        {s.id === "instrucao-atc"
                          ? t(
                              lang,
                              "Formação de controladores",
                              "Controller training",
                            )
                          : t(lang, "Formação de pilotos", "Pilot training")}
                      </h3>
                      <div className="staff-grid">{members.map(card)}</div>
                    </div>
                  ) : null;
                })}
              </section>
            );
          })}
          {departments.length === 0 && (
            <div className="empty-state">
              <Icon name="search" size={30} />
              <h3>
                {t(lang, "Nenhum resultado por aqui.", "No results here.")}
              </h3>
              <p>
                {t(
                  lang,
                  "Tente outro cargo ou departamento.",
                  "Try another role or department.",
                )}
              </p>
              <button
                className="button button-secondary"
                onClick={() => {
                  setQuery("");
                  setDepartment("all");
                }}
              >
                {t(lang, "Limpar filtros", "Clear filters")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
