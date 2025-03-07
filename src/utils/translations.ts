
export const getCategoryTranslation = (category: string, currentLanguage: string): string => {
  const translations: Record<string, { en: string; es: string }> = {
    "Tecnología": { en: "Technology", es: "Tecnología" },
    "Legal": { en: "Legal", es: "Legal" },
    "Finanzas": { en: "Finance", es: "Finanzas" },
    "Audiovisual": { en: "Audiovisual", es: "Audiovisual" },
    "Comunidad": { en: "Community", es: "Comunidad" },
    "Salud": { en: "Health", es: "Salud" }
  };
  
  const categoryTranslation = translations[category];
  return categoryTranslation 
    ? (currentLanguage === "en" ? categoryTranslation.en : categoryTranslation.es)
    : category;
};
