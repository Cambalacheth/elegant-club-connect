
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/useUser";
import { useContent } from "@/hooks/useContent";
import Navbar from "@/components/Navbar";
import ContentGrid from "@/components/content/ContentGrid";
import ContentSidebar from "@/components/content/ContentSidebar";
import ContentHeader from "@/components/content/ContentHeader";
import { ContentType } from "@/types/content";

const Content = () => {
  const { userRole } = useUser();
  const { contentItems, isLoading, refetch } = useContent("article");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [selectedType, setSelectedType] = useState<ContentType>("article");
  const { t } = useTranslation();

  const filteredContent = selectedCategory === "all"
    ? contentItems
    : contentItems.filter(item => item.category === selectedCategory);

  const handleTypeChange = (type: ContentType) => {
    setSelectedType(type);
  };

  const handleCategoryChange = (category: string | "all") => {
    setSelectedCategory(category);
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <ContentSidebar 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            userRole={userRole}
          />
          
          <div className="lg:col-span-3">
            <ContentGrid 
              items={filteredContent} 
              isLoading={isLoading} 
              contentType={selectedType}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Content;
