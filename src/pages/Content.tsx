import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, Newspaper, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: "article" | "video" | "guide" | "resource";
  link?: string;
  date: string;
}

const Content = () => {
  const location = useLocation();
  const [language, setLanguage] = useState("es"); // Default to Spanish
  const [activeTab, setActiveTab] = useState("articles");

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
  const comingSoonText = language === "en" ? "Coming Soon" : "Próximamente";
  const readMoreText = language === "en" ? "Read More" : "Leer Más";
  const watchText = language === "en" ? "Watch" : "Ver";

  // Sample content items - in a real application, these would come from a database
  const contentItems: ContentItem[] = [
    {
      id: "1",
      title: language === "en" ? "Introduction to Web3" : "Introducción a Web3",
      description: language === "en" 
        ? "Learn the basics of Web3 technology and blockchain fundamentals." 
        : "Aprende los conceptos básicos de la tecnología Web3 y los fundamentos de blockchain.",
      imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2232&auto=format&fit=crop",
      type: "article",
      date: "2023-12-01"
    },
    {
      id: "2",
      title: language === "en" ? "Building Community Projects" : "Construyendo Proyectos Comunitarios",
      description: language === "en"
        ? "A guide on how to start and grow community-driven technological projects."
        : "Una guía sobre cómo iniciar y hacer crecer proyectos tecnológicos impulsados por la comunidad.",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2340&auto=format&fit=crop",
      type: "guide",
      date: "2023-11-15"
    },
    {
      id: "3",
      title: language === "en" ? "Valencia Tech Ecosystem" : "Ecosistema Tech de Valencia",
      description: language === "en"
        ? "Discover the growing tech ecosystem in Valencia and its opportunities."
        : "Descubre el creciente ecosistema tecnológico en Valencia y sus oportunidades.",
      imageUrl: "https://images.unsplash.com/photo-1599484242577-1f99377f4c4a?q=80&w=2340&auto=format&fit=crop",
      type: "video",
      date: "2023-10-20"
    },
  ];

  // Filter content items by type
  const articles = contentItems.filter(item => item.type === "article");
  const videos = contentItems.filter(item => item.type === "video");
  const guides = contentItems.filter(item => item.type === "guide");
  const resources = contentItems.filter(item => item.type === "resource");

  const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "article":
        return <FileText className="h-5 w-5 text-club-orange" />;
      case "video":
        return <Video className="h-5 w-5 text-club-orange" />;
      case "guide":
        return <BookOpen className="h-5 w-5 text-club-orange" />;
      case "resource":
        return <Newspaper className="h-5 w-5 text-club-orange" />;
      default:
        return <FileText className="h-5 w-5 text-club-orange" />;
    }
  };

  const ContentCard = ({ item }: { item: ContentItem }) => {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="h-48 overflow-hidden">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center mb-3">
            <TypeIcon type={item.type} />
            <span className="ml-2 text-sm text-club-brown/70">{new Date(item.date).toLocaleDateString()}</span>
          </div>
          <h3 className="text-xl font-medium text-club-brown mb-2">{item.title}</h3>
          <p className="text-club-brown/80 mb-4">{item.description}</p>
          <a 
            href="#" 
            className="inline-flex items-center text-club-orange hover:text-club-terracotta"
          >
            {item.type === "video" ? watchText : readMoreText}
          </a>
        </div>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="bg-club-beige/30 rounded-lg p-12 text-center">
      <h3 className="text-2xl font-serif text-club-brown mb-2">{comingSoonText}</h3>
      <p className="text-club-brown/70">
        {language === "en" 
          ? "We're working on creating great content for this section. Stay tuned!" 
          : "Estamos trabajando en crear excelente contenido para esta sección. ¡Mantente atento!"}
      </p>
    </div>
  );

  return (
    <main className="min-h-screen bg-club-beige">
      <Navbar currentLanguage={language} />
      
      <div className="container mx-auto px-6 pt-32 pb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-club-brown text-center mb-12">
          {contentTitle}
        </h1>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white/50 p-1">
              <TabsTrigger 
                value="articles" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <FileText className="mr-2 h-4 w-4" />
                {articlesText}
              </TabsTrigger>
              
              <TabsTrigger 
                value="videos" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <Video className="mr-2 h-4 w-4" />
                {videosText}
              </TabsTrigger>
              
              <TabsTrigger 
                value="guides" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                {guidesText}
              </TabsTrigger>
              
              <TabsTrigger 
                value="resources" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <Newspaper className="mr-2 h-4 w-4" />
                {resourcesText}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="articles" className="mt-6">
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map(article => (
                  <ContentCard key={article.id} item={article} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
          
          <TabsContent value="videos" className="mt-6">
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map(video => (
                  <ContentCard key={video.id} item={video} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
          
          <TabsContent value="guides" className="mt-6">
            {guides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {guides.map(guide => (
                  <ContentCard key={guide.id} item={guide} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
          
          <TabsContent value="resources" className="mt-6">
            {resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources.map(resource => (
                  <ContentCard key={resource.id} item={resource} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
    </main>
  );
};

export default Content;
