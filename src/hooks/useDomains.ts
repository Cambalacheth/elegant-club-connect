
import { useState, useEffect } from 'react';

export interface Domain {
  id: string;
  name: string;
  path: string;
  description: string;
  status: "available" | "reserved" | "used";
  owner?: string;
}

// This is mock data for now, in the future this could come from Supabase
const mockDomains: Domain[] = [
  {
    id: '1',
    name: 'ElFotographer',
    path: '/ElFotographer',
    description: 'Dominio personalizado para un fotógrafo de la comunidad',
    status: 'used',
    owner: 'Carlos Rodríguez'
  },
  {
    id: '2',
    name: 'CodeMaster',
    path: '/CodeMaster',
    description: 'Espacio para compartir recursos de programación',
    status: 'reserved'
  },
  {
    id: '3',
    name: 'MenteTerra',
    path: '/MenteTerra',
    description: 'Blog sobre salud mental y bienestar',
    status: 'available'
  },
  {
    id: '4',
    name: 'CocinaEspañola',
    path: '/CocinaEspañola',
    description: 'Recetas tradicionales de la gastronomía española',
    status: 'available'
  },
  {
    id: '5',
    name: 'ArteLatino',
    path: '/ArteLatino',
    description: 'Exposición virtual de arte latinoamericano',
    status: 'reserved'
  },
  {
    id: '6',
    name: 'EcoTerreta',
    path: '/EcoTerreta',
    description: 'Iniciativas ecológicas y sostenibles',
    status: 'used',
    owner: 'María González'
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
