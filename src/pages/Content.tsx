
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/useUser";
import { useContent } from "@/hooks/useContent";
import Navbar from "@/components/Navbar";
import ContentGrid from "@/components/content/ContentGrid";
import ContentHeader from "@/components/content/ContentHeader";
import { ContentType } from "@/types/content";

const Content = () => {
  const { userRole } = useUser();
  const [selectedType, setSelectedType] = useState<ContentType>("article");
  const { t } = useTranslation();
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
        <title>{t("content.pageTitle")} | Terreta Hub</title>
        <meta name="description" content={t("content.pageDescription")} />
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
