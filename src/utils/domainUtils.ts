
import { Domain } from "@/types/domain";

// Provide fallback domains when the API fails
export const getFallbackDomains = (prioritizePaths: string[] = []): Domain[] => {
  const fallbackDomains: Domain[] = [
    {
      id: "legal-domain",
      name: "Legal",
      path: "/legal",
      description: "Servicios legales y consultoría jurídica",
      status: "available"
    },
    {
      id: "arte-domain",
      name: "Arte",
      path: "/arte",
      description: "Proyectos de arte",
      status: "available"
    },
    {
      id: "negocios-domain",
      name: "Negocios",
      path: "/negocios",
      description: "Recursos empresariales",
      status: "available"
    },
    {
      id: "salud-domain",
      name: "Salud",
      path: "/salud",
      description: "Recursos de salud",
      status: "available"
    },
    {
      id: "comunidad-domain",
      name: "Comunidad",
      path: "/comunidad",
      description: "El espacio central para todo lo relacionado con nuestra comunidad",
      status: "available"
    },
    {
      id: "tech-domain",
      name: "Tech",
      path: "/tech",
      description: "Información y recursos sobre ciencia y tecnología",
      status: "available"
    },
    {
      id: "dominios-domain",
      name: "Dominios",
      path: "/dominio",
      description: "Administración de dominios",
      status: "used"
    },
    {
      id: "eventos-domain",
      name: "Eventos",
      path: "/events",
      description: "Calendario de eventos de la comunidad",
      status: "used"
    },
    {
      id: "contenido-domain",
      name: "Contenido",
      path: "/content",
      description: "Portal de contenido y recursos informativos",
      status: "used"
    },
    {
      id: "miembros-domain",
      name: "Miembros",
      path: "/members",
      description: "Directorio de miembros de la comunidad",
      status: "used"
    }
  ];
  
  // Prioritize domains if needed
  if (prioritizePaths.length > 0) {
    return [
      ...fallbackDomains.filter(d => prioritizePaths.includes(d.path)),
      ...fallbackDomains.filter(d => !prioritizePaths.includes(d.path))
    ];
  }
  
  return fallbackDomains;
};

// Format domains from the database
export const formatDomains = (
  data: any[], 
  prioritizePaths: string[] = []
): Domain[] => {
  if (!data || data.length === 0) {
    return [];
  }
  
  let formattedDomains: Domain[] = data.map(domain => ({
    id: domain.id,
    name: domain.name,
    path: domain.path,
    description: domain.description || '',
    status: domain.status as "available" | "reserved" | "used",
    owner: domain.owner,
    externalUrl: domain.external_url
  }));
  
  // Prioritize specific paths if needed
  if (prioritizePaths.length > 0) {
    formattedDomains = [
      ...formattedDomains.filter(d => prioritizePaths.includes(d.path)),
      ...formattedDomains.filter(d => !prioritizePaths.includes(d.path))
    ];
  }
  
  return formattedDomains;
};
