
export const getCategoryOptions = (currentLanguage: string) => [
  { id: "Legal", label: currentLanguage === "en" ? "Legal" : "Legal" },
  { id: "Tecnología", label: currentLanguage === "en" ? "Technology" : "Tecnología" },
  { id: "Finanzas", label: currentLanguage === "en" ? "Finance" : "Finanzas" },
  { id: "Audiovisual", label: currentLanguage === "en" ? "Audiovisual" : "Audiovisual" },
  { id: "Comunidad", label: currentLanguage === "en" ? "Community" : "Comunidad" },
  { id: "Salud", label: currentLanguage === "en" ? "Health" : "Salud" },
  { id: "Dominios", label: currentLanguage === "en" ? "Domains" : "Dominios" },
];
