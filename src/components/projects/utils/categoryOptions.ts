
export interface CategoryOption {
  id: string;
  label: {
    en: string;
    es: string;
  };
}

export const getCategoryOptions = (language: string): CategoryOption[] => {
  return [
    { id: "Legal", label: { en: "Legal", es: "Legal" } },
    { id: "Tecnología", label: { en: "Technology", es: "Tecnología" } },
    { id: "Finanzas", label: { en: "Finance", es: "Finanzas" } },
    { id: "Audiovisual", label: { en: "Audiovisual", es: "Audiovisual" } },
    { id: "Comunidad", label: { en: "Community", es: "Comunidad" } },
    { id: "Salud", label: { en: "Health", es: "Salud" } },
  ];
};

export const getCategoryLabel = (categoryId: string, language: string): string => {
  const category = getCategoryOptions(language).find(cat => cat.id === categoryId);
  return category ? (language === "en" ? category.label.en : category.label.es) : categoryId;
};
