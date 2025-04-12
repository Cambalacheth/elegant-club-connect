
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useUser } from "@/hooks/useUser";
import { useContent } from "@/hooks/useContent";
import Navbar from "@/components/Navbar";
import ContentGrid from "@/components/content/ContentGrid";
import ContentHeader from "@/components/content/ContentHeader";
import ContentSidebar from "@/components/content/ContentSidebar";
import { ContentType } from "@/types/content";

const Content = () => {
  const { userRole } = useUser();
  const [selectedType, setSelectedType] = useState<ContentType>("article");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const { contentItems, isLoading, refetch } = useContent(selectedType);

  const handleTypeChange = (type: ContentType) => {
    setSelectedType(type);
  };

  const handleCategoryChange = (category: string | "all") => {
    setSelectedCategory(category);
  };

  // Refetch content when type or category changes
  useEffect(() => {
    console.log("Content type or category changed, refetching content:", selectedType, selectedCategory);
    refetch();
  }, [selectedType, selectedCategory, refetch]);

  // Filter content by category if not "all"
  const filteredContent = selectedCategory === "all" 
    ? contentItems 
    : contentItems.filter(item => item.category === selectedCategory);

  console.log("Rendering ContentGrid with items:", filteredContent.length);

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
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ContentSidebar 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              userRole={userRole}
            />
          </div>
          
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
