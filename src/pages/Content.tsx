
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useUser } from "@/hooks/useUser";
import { useContent } from "@/hooks/useContent";
import Navbar from "@/components/Navbar";
import ContentGrid from "@/components/content/ContentGrid";
import ContentHeader from "@/components/content/ContentHeader";
import { ContentType } from "@/types/content";

const Content = () => {
  const { userRole } = useUser();
  const [selectedType, setSelectedType] = useState<ContentType>("article");
  const { contentItems, isLoading, refetch } = useContent(selectedType);

  const handleTypeChange = (type: ContentType) => {
    setSelectedType(type);
  };

  // Refetch content when type changes
  useEffect(() => {
    refetch();
  }, [selectedType, refetch]);

  return (
    <div className="min-h-screen bg-club-beige-light">
      <Helmet>
        <title>Recursos | Terreta Hub</title>
        <meta name="description" content="Recursos y contenido para la comunidad" />
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <ContentHeader 
          selectedType={selectedType} 
          onTypeChange={handleTypeChange}
        />
        
        <div className="mt-8">
          <ContentGrid 
            items={contentItems} 
            isLoading={isLoading} 
            contentType={selectedType}
          />
        </div>
      </main>
    </div>
  );
};

export default Content;
