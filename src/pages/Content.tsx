
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, Newspaper, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import { ContentList } from "@/components/content/ContentList";
import { ContentManagement } from "@/components/content/ContentManagement";
import { useContent } from "@/hooks/useContent";
import { ContentType } from "@/types/content";
import { useForumUser } from "@/hooks/useForumUser";

const Content = () => {
  const location = useLocation();
  const [language, setLanguage] = useState("es"); // Default to Spanish
  const [activeTab, setActiveTab] = useState<ContentType | "management">("article");
  const { user, userRole, isLoading: isUserLoading } = useForumUser();
  const { content, isLoading: isContentLoading } = useContent(activeTab as ContentType);

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

  // SEO title and meta description
  const pageTitle = `${contentTitle} | Terreta Hub`;
  const pageDescription = language === "en" 
    ? "Explore community content including articles, videos, guides and resources."
    : "Explora el contenido de la comunidad incluyendo artículos, videos, guías y recursos.";

  return (
    <div className="min-h-screen bg-club-beige">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/content`} />
      </Helmet>
      
      <Navbar currentLanguage={language} />
      
      <main className="container mx-auto px-6 pt-32 pb-16">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-club-brown text-center">
            {contentTitle}
          </h1>
        </header>
        
        <Tabs 
          defaultValue="article" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ContentType | "management")} 
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white/50 p-1" aria-label="Categorías de contenido">
              <TabsTrigger 
                value="article" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{articlesText}</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="video" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <Video className="mr-2 h-4 w-4" />
                <span>{videosText}</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="guide" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                <span>{guidesText}</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="resource" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <Newspaper className="mr-2 h-4 w-4" />
                <span>{resourcesText}</span>
              </TabsTrigger>
              
              {!isUserLoading && user && userRole === 'admin' && (
                <TabsTrigger 
                  value="management" 
                  className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
                >
                  <span>{managementText}</span>
                </TabsTrigger>
              )}
            </TabsList>
          </div>
          
          <TabsContent value="article" className="mt-6">
            <section aria-labelledby="articles-heading">
              <h2 id="articles-heading" className="sr-only">{articlesText}</h2>
              <ContentList 
                items={content}
                type="article"
                isLoading={isContentLoading}
                currentLanguage={language}
              />
            </section>
          </TabsContent>
          
          <TabsContent value="video" className="mt-6">
            <section aria-labelledby="videos-heading">
              <h2 id="videos-heading" className="sr-only">{videosText}</h2>
              <ContentList 
                items={content}
                type="video"
                isLoading={isContentLoading}
                currentLanguage={language}
              />
            </section>
          </TabsContent>
          
          <TabsContent value="guide" className="mt-6">
            <section aria-labelledby="guides-heading">
              <h2 id="guides-heading" className="sr-only">{guidesText}</h2>
              <ContentList 
                items={content}
                type="guide"
                isLoading={isContentLoading}
                currentLanguage={language}
              />
            </section>
          </TabsContent>
          
          <TabsContent value="resource" className="mt-6">
            <section aria-labelledby="resources-heading">
              <h2 id="resources-heading" className="sr-only">{resourcesText}</h2>
              <ContentList 
                items={content}
                type="resource"
                isLoading={isContentLoading}
                currentLanguage={language}
              />
            </section>
          </TabsContent>
          
          {!isUserLoading && user && userRole === 'admin' && (
            <TabsContent value="management" className="mt-6">
              <section aria-labelledby="management-heading">
                <h2 id="management-heading" className="sr-only">{managementText}</h2>
                <ContentManagement 
                  userId={user.id} 
                  userRole={userRole}
                />
              </section>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Content;
