
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
    "Eventos": { en: "Events", es: "Eventos" },
    "Arte": { en: "Art", es: "Arte" },
    "Negocios": { en: "Business", es: "Negocios" },
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

export const getCommonTexts = (currentLanguage: string) => ({
  // General UI
  save: currentLanguage === "en" ? "Save" : "Guardar",
  cancel: currentLanguage === "en" ? "Cancel" : "Cancelar",
  delete: currentLanguage === "en" ? "Delete" : "Eliminar",
  edit: currentLanguage === "en" ? "Edit" : "Editar",
  view: currentLanguage === "en" ? "View" : "Ver",
  search: currentLanguage === "en" ? "Search" : "Buscar",
  loading: currentLanguage === "en" ? "Loading..." : "Cargando...",
  noResults: currentLanguage === "en" ? "No results found" : "No se encontraron resultados",
  
  // Navigation and sections
  home: currentLanguage === "en" ? "Home" : "Inicio",
  projects: currentLanguage === "en" ? "Projects" : "Proyectos",
  events: currentLanguage === "en" ? "Events" : "Eventos",
  members: currentLanguage === "en" ? "Members" : "Miembros",
  forum: currentLanguage === "en" ? "Forum" : "Foro",
  profile: currentLanguage === "en" ? "Profile" : "Perfil",
  
  // Authentication
  login: currentLanguage === "en" ? "Log in" : "Iniciar sesión",
  signup: currentLanguage === "en" ? "Sign up" : "Registrarse",
  logout: currentLanguage === "en" ? "Log out" : "Cerrar sesión",
  
  // Feedback
  success: currentLanguage === "en" ? "Success" : "Éxito",
  error: currentLanguage === "en" ? "Error" : "Error",
  
  // Actions
  submit: currentLanguage === "en" ? "Submit" : "Enviar",
  update: currentLanguage === "en" ? "Update" : "Actualizar",
  create: currentLanguage === "en" ? "Create" : "Crear",
  upload: currentLanguage === "en" ? "Upload" : "Subir",
  
  // Project specific
  newProject: currentLanguage === "en" ? "New Project" : "Nuevo Proyecto",
  noProjects: currentLanguage === "en" ? "No projects found" : "No se encontraron proyectos",
  projectDetails: currentLanguage === "en" ? "Project Details" : "Detalles del Proyecto",
  
  // Event specific
  upcomingEvents: currentLanguage === "en" ? "Upcoming Events" : "Próximos Eventos",
  pastEvents: currentLanguage === "en" ? "Past Events" : "Eventos Pasados",
  registerEvent: currentLanguage === "en" ? "Register" : "Registrarse",
  
  // Forum specific
  newTopic: currentLanguage === "en" ? "New Topic" : "Nuevo Tema",
  reply: currentLanguage === "en" ? "Reply" : "Responder",
  
  // User specific
  myProfile: currentLanguage === "en" ? "My Profile" : "Mi Perfil",
  editProfile: currentLanguage === "en" ? "Edit Profile" : "Editar Perfil",
});
