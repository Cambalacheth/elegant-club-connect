
export const getPageTitle = (currentPath: string, currentLanguage: string) => {
  if (currentPath === "/legal") return currentLanguage === "en" ? "Legal - Terreta Hub" : "Legal - Terreta Hub";
  if (currentPath === "/arte") return currentLanguage === "en" ? "Art - Terreta Hub" : "Arte - Terreta Hub";
  if (currentPath === "/negocios") return currentLanguage === "en" ? "Business - Terreta Hub" : "Negocios - Terreta Hub";
  if (currentPath === "/salud") return currentLanguage === "en" ? "Health - Terreta Hub" : "Salud - Terreta Hub";
  if (currentPath === "/comunidad") return currentLanguage === "en" ? "Community - Terreta Hub" : "Comunidad - Terreta Hub";
  if (currentPath === "/tech") return currentLanguage === "en" ? "Technology - Terreta Hub" : "Tecnología - Terreta Hub";
  return currentLanguage === "en" ? "Domains - Terreta Hub" : "Dominios - Terreta Hub";
};

export const getPageDescription = (isVerticalPage: boolean, currentLanguage: string, getVerticalName: () => string) => {
  if (isVerticalPage) {
    return currentLanguage === "en" 
      ? `Explore and discover content in the ${getVerticalName()} vertical`
      : `Explora y descubre contenido en la vertical de ${getVerticalName()}`;
  }
  return currentLanguage === "en" 
    ? "Customize your presence on Terreta Hub with branded domains"
    : "Personaliza tu presencia en Terreta Hub con dominios personalizados";
};

export const getVerticalName = (currentPath: string, currentLanguage: string) => {
  if (currentPath === "/legal") return currentLanguage === "en" ? "Legal" : "Legal";
  if (currentPath === "/arte") return currentLanguage === "en" ? "Art" : "Arte";
  if (currentPath === "/negocios") return currentLanguage === "en" ? "Business" : "Negocios";
  if (currentPath === "/salud") return currentLanguage === "en" ? "Health" : "Salud";
  if (currentPath === "/comunidad") return currentLanguage === "en" ? "Community" : "Comunidad";
  if (currentPath === "/tech") return currentLanguage === "en" ? "Technology" : "Tecnología";
  return "";
};

export const getConceptTitle = (isVerticalPage: boolean, currentLanguage: string, getVerticalName: () => string) => {
  return isVerticalPage 
    ? (currentLanguage === "en" ? `The ${getVerticalName()} Vertical` : `La Vertical de ${getVerticalName()}`)
    : (currentLanguage === "en" ? "The Domains Concept" : "El Concepto de Dominios");
};

export const getConceptDesc = (isVerticalPage: boolean, currentLanguage: string, getVerticalName: () => string) => {
  return isVerticalPage
    ? (currentLanguage === "en" 
      ? `Explore our ${getVerticalName()} vertical, a dedicated space for content and resources related to ${getVerticalName().toLowerCase()}.` 
      : `Explora nuestra vertical de ${getVerticalName()}, un espacio dedicado a contenido y recursos relacionados con ${getVerticalName().toLowerCase()}.`)
    : (currentLanguage === "en" 
      ? "At Terreta Hub, we've reimagined how community members can establish their presence." 
      : "En Terreta Hub, hemos reimaginado cómo los miembros de la comunidad pueden establecer su presencia.");
};

export const getDomainsTitle = (isVerticalPage: boolean, currentLanguage: string, getVerticalName: () => string) => {
  return isVerticalPage
    ? (currentLanguage === "en" ? `${getVerticalName()} Domains` : `Dominios de ${getVerticalName()}`)
    : (currentLanguage === "en" ? "Browse Domains" : "Explorar Dominios");
};

export const getSearchPlaceholder = (currentLanguage: string) => {
  return currentLanguage === "en" ? "Search domains..." : "Buscar dominios...";
};
