
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, Newspaper, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import { ContentList } from "@/components/content/ContentList";
import { ContentManagement } from "@/components/content/ContentManagement";
import { useContent } from "@/hooks/useContent";
import { ContentType } from "@/types/content";
import { useForumUser } from "@/hooks/useForumUser";
import { canManageContent } from "@/types/user";

const Content = () => {
  const location = useLocation();
  const [language, setLanguage] = useState("es"); // Default to Spanish
  const [activeTab, setActiveTab] = useState<ContentType>("article");
  const { user, userRole, isLoading: isUserLoading } = useForumUser();
  const { content, isLoading: isContentLoading } = useContent(activeTab);

  useEffect(() => {
    // Extract language from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const langParam = searchParams.get("lang");
    if (langParam && (langParam === "es" || langParam === "en")) {
      setLanguage(langParam);
      console.log(`Language set to: ${langParam}`);
    }
  }, [location]);

  // Text based on selected language
  const contentTitle = language === "en" ? "Community Content" : "Contenido de la Comunidad";
  const articlesText = language === "en" ? "Articles" : "Artículos";
  const videosText = language === "en" ? "Videos" : "Videos";
  const guidesText = language === "en" ? "Guides" : "Guías";
  const resourcesText = language === "en" ? "Resources" : "Recursos";
  const managementText = language === "en" ? "Content Management" : "Gestión de Contenido";

  return (
    <main className="min-h-screen bg-club-beige">
      <Navbar currentLanguage={language} />
      
      <div className="container mx-auto px-6 pt-32 pb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-club-brown text-center mb-12">
          {contentTitle}
        </h1>
        
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as ContentType)} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white/50 p-1">
              <TabsTrigger 
                value="article" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <FileText className="mr-2 h-4 w-4" />
                {articlesText}
              </TabsTrigger>
              
              <TabsTrigger 
                value="video" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <Video className="mr-2 h-4 w-4" />
                {videosText}
              </TabsTrigger>
              
              <TabsTrigger 
                value="guide" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                {guidesText}
              </TabsTrigger>
              
              <TabsTrigger 
                value="resource" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <Newspaper className="mr-2 h-4 w-4" />
                {resourcesText}
              </TabsTrigger>
              
              {!isUserLoading && user && canManageContent(userRole) && (
                <TabsTrigger 
                  value="management" 
                  className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
                >
                  {managementText}
                </TabsTrigger>
              )}
            </TabsList>
          </div>
          
          <TabsContent value="article" className="mt-6">
            <ContentList 
              items={content}
              type="article"
              isLoading={isContentLoading}
              currentLanguage={language}
            />
          </TabsContent>
          
          <TabsContent value="video" className="mt-6">
            <ContentList 
              items={content}
              type="video"
              isLoading={isContentLoading}
              currentLanguage={language}
            />
          </TabsContent>
          
          <TabsContent value="guide" className="mt-6">
            <ContentList 
              items={content}
              type="guide"
              isLoading={isContentLoading}
              currentLanguage={language}
            />
          </TabsContent>
          
          <TabsContent value="resource" className="mt-6">
            <ContentList 
              items={content}
              type="resource"
              isLoading={isContentLoading}
              currentLanguage={language}
            />
          </TabsContent>
          
          {!isUserLoading && user && canManageContent(userRole) && (
            <TabsContent value="management" className="mt-6">
              <ContentManagement 
                userId={user.id} 
                userRole={userRole}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </main>
  );
};

export default Content;
