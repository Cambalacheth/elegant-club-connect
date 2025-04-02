
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

// Mock data for domains, in the future this could come from Supabase
const mockDomains: Domain[] = [
  {
    id: '1',
    name: 'ElFotographer',
    path: '/elfotographer',
    description: 'Servicio de fotografía profesional',
    status: 'used',
    owner: 'Carlos Rodríguez',
    externalUrl: 'https://stealthy-capture-experience.lovable.app/'
  },
  {
    id: '2',
    name: 'Legal',
    path: '/legal',
    description: 'Servicios legales y consultoría jurídica',
    status: 'available'
  },
  {
    id: '3',
    name: 'Juegos',
    path: '/juegos',
    description: 'Comunidad de desarrollo de videojuegos',
    status: 'available'
  },
  {
    id: '4',
    name: 'Web3',
    path: '/web3',
    description: 'Recursos y proyectos relacionados con blockchain y Web3',
    status: 'available'
  },
  {
    id: '5',
    name: 'Diseño',
    path: '/diseno',
    description: 'Servicios de diseño gráfico e industrial',
    status: 'reserved'
  },
  {
    id: '6',
    name: 'Marketing',
    path: '/marketing',
    description: 'Estrategias y servicios de marketing digital',
    status: 'available'
  },
  {
    id: '7',
    name: 'Programación',
    path: '/programacion',
    description: 'Recursos para desarrolladores de software',
    status: 'available'
  },
  {
    id: '8',
    name: 'Emprendedores',
    path: '/emprendedores',
    description: 'Comunidad de startups y emprendimientos',
    status: 'reserved'
  },
  {
    id: '9',
    name: 'Música',
    path: '/musica',
    description: 'Plataforma para músicos y productores',
    status: 'available'
  },
  {
    id: '10',
    name: 'Educación',
    path: '/educacion',
    description: 'Recursos educativos y formación online',
    status: 'available'
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

