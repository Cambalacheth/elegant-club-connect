
import { useState, useEffect } from 'react';

export interface Domain {
  id: string;
  name: string;
  path: string;
  description: string;
  status: "available" | "reserved" | "used";
  owner?: string;
  externalUrl?: string;
}

// Enhanced mock data for domains, removed elfotographer and added more domains
const mockDomains: Domain[] = [
  {
    id: '1',
    name: 'Legal',
    path: '/legal',
    description: 'Servicios legales y consultoría jurídica',
    status: 'available'
  },
  {
    id: '2',
    name: 'Juegos',
    path: '/juegos',
    description: 'Comunidad de desarrollo de videojuegos',
    status: 'available'
  },
  {
    id: '3',
    name: 'Web3',
    path: '/web3',
    description: 'Recursos y proyectos relacionados con blockchain y Web3',
    status: 'available'
  },
  {
    id: '4',
    name: 'Diseño',
    path: '/diseno',
    description: 'Servicios de diseño gráfico e industrial',
    status: 'reserved'
  },
  {
    id: '5',
    name: 'Marketing',
    path: '/marketing',
    description: 'Estrategias y servicios de marketing digital',
    status: 'available'
  },
  {
    id: '6',
    name: 'Programación',
    path: '/programacion',
    description: 'Recursos para desarrolladores de software',
    status: 'available'
  },
  {
    id: '7',
    name: 'Emprendedores',
    path: '/emprendedores',
    description: 'Comunidad de startups y emprendimientos',
    status: 'reserved'
  },
  {
    id: '8',
    name: 'Música',
    path: '/musica',
    description: 'Plataforma para músicos y productores',
    status: 'available'
  },
  {
    id: '9',
    name: 'Educación',
    path: '/educacion',
    description: 'Recursos educativos y formación online',
    status: 'available'
  },
  {
    id: '10',
    name: 'Proyectos',
    path: '/projects',
    description: 'Proyectos de la comunidad',
    status: 'used'
  },
  {
    id: '11',
    name: 'Miembros',
    path: '/members',
    description: 'Directorio de miembros de la comunidad',
    status: 'used'
  },
  {
    id: '12',
    name: 'Foro',
    path: '/forum',
    description: 'Espacio para debates y discusiones',
    status: 'used'
  },
  {
    id: '13',
    name: 'Contenido',
    path: '/content',
    description: 'Artículos, videos y recursos de la comunidad',
    status: 'used'
  },
  {
    id: '14',
    name: 'Eventos',
    path: '/events',
    description: 'Calendario de eventos de la comunidad',
    status: 'used'
  },
  {
    id: '15',
    name: 'Asado',
    path: '/asado',
    description: 'Registro para el evento de asado',
    status: 'used'
  },
  {
    id: '16',
    name: 'Feedback',
    path: '/feedback',
    description: 'Sistema para enviar opiniones y comentarios',
    status: 'used'
  },
  {
    id: '17',
    name: 'Admin',
    path: '/admin',
    description: 'Panel de administración',
    status: 'used',
    owner: 'Administradores'
  },
  {
    id: '18',
    name: 'Buscar',
    path: '/search',
    description: 'Sistema de búsqueda del sitio',
    status: 'used'
  }
];

export const useDomains = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call with a small delay
    const fetchDomains = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be a Supabase query
        await new Promise(resolve => setTimeout(resolve, 600));
        setDomains(mockDomains);
        setError(null);
      } catch (err) {
        console.error('Error fetching domains:', err);
        setError('Failed to load domains');
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  return { domains, loading, error };
};
