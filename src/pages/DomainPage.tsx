
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDomains } from "@/hooks/useDomains";
import { ExternalLink } from "lucide-react";

const DomainPage = () => {
  const { domains, loading } = useDomains();
  const [currentLanguage, setCurrentLanguage] = useState("es");
  
  const title = currentLanguage === "en" ? "Domains - Terreta Hub" : "Dominios - Terreta Hub";
  const description = currentLanguage === "en" 
    ? "Customize your presence on Terreta Hub with branded domains"
    : "Personaliza tu presencia en Terreta Hub con dominios personalizados";
    
  const conceptTitle = currentLanguage === "en" ? "The Domains Concept" : "El Concepto de Dominios";
  const conceptDesc = currentLanguage === "en" 
    ? "At Terreta Hub, we've reimagined how community members can establish their presence." 
    : "En Terreta Hub, hemos reimaginado cómo los miembros de la comunidad pueden establecer su presencia.";
  
  const domainsTitle = currentLanguage === "en" ? "Available Domains" : "Dominios Disponibles";
  const statusLabels = {
    available: currentLanguage === "en" ? "Available" : "Disponible",
    reserved: currentLanguage === "en" ? "Reserved" : "Reservado",
    used: currentLanguage === "en" ? "In Use" : "En Uso",
  };

  const handleDomainAction = (domain: any) => {
    if (domain.externalUrl) {
      window.open(domain.externalUrl, '_blank');
    } else if (domain.status === 'used') {
      window.location.href = domain.path;
    }
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      
      <Navbar currentLanguage={currentLanguage} />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-club-brown mb-8">
            {conceptTitle}
          </h1>
          
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">
                {currentLanguage === "en" ? "What are Terreta Domains?" : "¿Qué son los Dominios Terreta?"}
              </CardTitle>
              <CardDescription>
                {conceptDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {currentLanguage === "en" 
                  ? "Traditional websites offer standard pages like /events or /projects. At Terreta Hub, we go beyond by allowing members to create branded domains - custom pages that represent their personal brand or project."
                  : "Los sitios web tradicionales ofrecen páginas estándar como /eventos o /proyectos. En Terreta Hub, vamos más allá al permitir a los miembros crear dominios personalizados - páginas a medida que representan su marca personal o proyecto."}
              </p>
              <p>
                {currentLanguage === "en"
                  ? "For example, a photographer might have terretahub.com/ElFotographer as their personal branded domain, while a developer might have terretahub.com/CodeMaster."
                  : "Por ejemplo, un fotógrafo podría tener terretahub.com/ElFotographer como su dominio personalizado, mientras que un desarrollador podría tener terretahub.com/CodeMaster."}
              </p>
              <p className="font-semibold">
                {currentLanguage === "en"
                  ? "This creates a unique ecosystem where each member can have their own branded space within the larger Terreta community."
                  : "Esto crea un ecosistema único donde cada miembro puede tener su propio espacio personalizado dentro de la comunidad Terreta más amplia."}
              </p>
              <div className="pt-4">
                <Button 
                  onClick={() => window.location.href = "/ElFotographer"}
                  className="bg-club-orange text-white hover:bg-club-terracotta flex items-center gap-2"
                >
                  {currentLanguage === "en"
                    ? "See Example: ElFotographer"
                    : "Ver Ejemplo: ElFotographer"}
                  <ExternalLink size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="font-serif text-2xl font-semibold text-club-brown mb-4">
            {domainsTitle}
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <p>{currentLanguage === "en" ? "Loading domains..." : "Cargando dominios..."}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{currentLanguage === "en" ? "Domain Name" : "Nombre de Dominio"}</TableHead>
                    <TableHead>{currentLanguage === "en" ? "Path" : "Ruta"}</TableHead>
                    <TableHead>{currentLanguage === "en" ? "Description" : "Descripción"}</TableHead>
                    <TableHead>{currentLanguage === "en" ? "Status" : "Estado"}</TableHead>
                    <TableHead>{currentLanguage === "en" ? "Action" : "Acción"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.filter(domain => domain.name.toLowerCase() !== "elfotographer").map((domain) => (
                    <TableRow key={domain.id}>
                      <TableCell className="font-medium">{domain.name}</TableCell>
                      <TableCell>{domain.path}</TableCell>
                      <TableCell>{domain.description}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${domain.status === 'available' ? 'bg-green-100 text-green-800' : 
                              domain.status === 'reserved' ? 'bg-amber-100 text-amber-800' : 
                              'bg-blue-100 text-blue-800'}`}
                        >
                          {statusLabels[domain.status]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDomainAction(domain)}
                          disabled={domain.status === 'reserved'}
                          className={domain.externalUrl ? "flex items-center gap-1" : ""}
                        >
                          {currentLanguage === "en" ? "Visit" : "Visitar"}
                          {domain.externalUrl && <ExternalLink size={14} />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DomainPage;
