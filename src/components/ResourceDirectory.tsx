"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { getResources, t } from "@/lib/portal";
export default function ResourceDirectory({
  lang,
  initialQuery = "",
  initialCategory = "all",
}: {
  lang: string;
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(
    ["all", "pilot", "atc", "community", "favorites"].includes(initialCategory)
      ? initialCategory
      : "all",
  );
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const stored: unknown = JSON.parse(
          localStorage.getItem("vatbrz-favorites") || "[]",
        );
        if (Array.isArray(stored))
          setFavorites(
            stored.filter((item): item is string => typeof item === "string"),
          );
      } catch {}
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const toggle = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    setFavorites(next);
    try {
      localStorage.setItem("vatbrz-favorites", JSON.stringify(next));
    } catch {}
  };
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const resources = getResources(lang).filter(
    (resource) =>
      (category === "all" ||
        category === resource.category ||
        (category === "favorites" && favorites.includes(resource.id))) &&
      normalize(
        resource.title + resource.description + resource.provider,
      ).includes(normalize(query)),
  );
  const categories = [
    ["all", t(lang, "Todos", "All")],
    ["pilot", t(lang, "Pilotos", "Pilots")],
    ["atc", "ATC"],
    ["community", t(lang, "Comunidade", "Community")],
    ["favorites", t(lang, "Meus favoritos", "My favorites")],
  ];
  return (
    <div className="resource-directory">
      <div className="directory-toolbar">
        <label className="search-input">
          <Icon name="search" />
          <span className="sr-only">
            {t(lang, "Buscar recursos", "Search resources")}
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              lang,
              "O que você precisa para o próximo voo?",
              "What do you need for your next flight?",
            )}
          />
        </label>
        <span className="muted small">
          {t(
            lang,
            "Seus favoritos ficam salvos neste navegador.",
            "Your favorites are saved in this browser.",
          )}
        </span>
      </div>
      <div
        className="filter-row"
        aria-label={t(lang, "Filtrar recursos", "Filter resources")}
      >
        {categories.map(([id, label]) => (
          <button
            type="button"
            key={id}
            aria-pressed={category === id}
            onClick={() => setCategory(id)}
          >
            {id === "favorites" && <Icon name="star" size={15} />} {label}
          </button>
        ))}
      </div>
      <p className="result-count" role="status">
        {resources.length} {t(lang, "recursos encontrados", "resources found")}
      </p>
      <div className="resource-grid">
        {resources.map((resource) => (
          <article className="resource-card" key={resource.id}>
            <div className="card-top">
              <span className="icon-box">
                <Icon name={resource.icon} />
              </span>
              <button
                disabled={!ready}
                type="button"
                className={
                  "favorite-button " +
                  (favorites.includes(resource.id) ? "is-favorite" : "")
                }
                aria-pressed={favorites.includes(resource.id)}
                aria-label={
                  t(lang, "Favoritar: ", "Favorite: ") + resource.title
                }
                onClick={() => toggle(resource.id)}
              >
                <Icon name="star" size={19} />
              </button>
            </div>
            <span className="eyebrow">{resource.provider}</span>
            <h3>
              <Link
                href={resource.href}
                target={
                  resource.href.startsWith("https") ? "_blank" : undefined
                }
                rel={
                  resource.href.startsWith("https")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                {resource.title}
                <Icon
                  name={
                    resource.href.startsWith("https") ? "external" : "arrow"
                  }
                  size={17}
                />
              </Link>
            </h3>
            <p>{resource.description}</p>
          </article>
        ))}
      </div>
      {resources.length === 0 && (
        <div className="empty-state">
          <Icon name={category === "favorites" ? "star" : "search"} size={32} />
          <h3>
            {t(
              lang,
              category === "favorites"
                ? "Seus atalhos favoritos ficam aqui."
                : "Nenhum recurso encontrado.",
              category === "favorites"
                ? "Your favorite shortcuts belong here."
                : "No resources found.",
            )}
          </h3>
          <p>
            {t(
              lang,
              "Experimente outra busca ou marque a estrela de um recurso.",
              "Try another search or star a resource.",
            )}
          </p>
          <button
            className="button button-secondary"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            {t(lang, "Ver todos os recursos", "See all resources")}
          </button>
        </div>
      )}
    </div>
  );
}
