import "server-only";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  "pt-br": () =>
    import("./dictionaries/pt-br.json").then((module) => module.default),
};

export const getDictionary = async (locale: "en" | "pt-br") => {
  return dictionaries[locale]
    ? dictionaries[locale]()
    : dictionaries["pt-br"]();
};
