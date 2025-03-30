
export const getCategoryTranslation = (category: string, currentLanguage: string): string => {
  const translations: Record<string, { en: string; es: string }> = {
    "Tecnología": { en: "Technology", es: "Tecnología" },
    "Legal": { en: "Legal", es: "Legal" },
    "Finanzas": { en: "Finance", es: "Finanzas" },
    "Audiovisual": { en: "Audiovisual", es: "Audiovisual" },
    "Comunidad": { en: "Community", es: "Comunidad" },
    "Salud": { en: "Health", es: "Salud" },
    "General": { en: "General", es: "General" },
    "Networking": { en: "Networking", es: "Networking" },
    "Cultura": { en: "Culture", es: "Cultura" },
    "Educación": { en: "Education", es: "Educación" },
    "Emprendimiento": { en: "Entrepreneurship", es: "Emprendimiento" },
    "Sostenibilidad": { en: "Sustainability", es: "Sostenibilidad" },
  };
  
  const categoryTranslation = translations[category];
  return categoryTranslation 
    ? (currentLanguage === "en" ? categoryTranslation.en : categoryTranslation.es)
    : category;
};

export const getLanguageName = (code: string, currentLanguage: string = "es"): string => {
  const languages: Record<string, { en: string; es: string }> = {
    "es": { en: "Spanish", es: "Español" },
    "en": { en: "English", es: "Inglés" },
    "fr": { en: "French", es: "Francés" },
    "de": { en: "German", es: "Alemán" },
    "it": { en: "Italian", es: "Italiano" },
    "pt": { en: "Portuguese", es: "Portugués" },
    "ca": { en: "Catalan", es: "Catalán" },
  };
  
  const languageTranslation = languages[code];
  return languageTranslation 
    ? (currentLanguage === "en" ? languageTranslation.en : languageTranslation.es)
    : code;
};
