
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface DomainConceptProps {
  conceptTitle: string;
  conceptDesc: string;
  currentLanguage: string;
}

const DomainConcept = ({ conceptTitle, conceptDesc, currentLanguage }: DomainConceptProps) => {
  return (
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
        <p className="font-semibold">
          {currentLanguage === "en"
            ? "This creates a unique ecosystem where each member can have their own branded space within the larger Terreta community."
            : "Esto crea un ecosistema único donde cada miembro puede tener su propio espacio personalizado dentro de la comunidad Terreta más amplia."}
        </p>
      </CardContent>
    </Card>
  );
};

export default DomainConcept;
