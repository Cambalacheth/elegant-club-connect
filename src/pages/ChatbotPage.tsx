
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/navbar/Navbar";
import ChatbotDomain from "@/components/chatbot/ChatbotDomain";
import DomainChatbot from "@/components/domains/DomainChatbot";

const ChatbotPage = () => {
  // Instead of hardcoding the type, let's use a more flexible approach
  // that allows for string comparison with "en" and "es"
  const currentLanguage = "es" as string; 
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {currentLanguage === "en" ? "Terreta Assistant - Terreta Hub" : "Asistente de Terreta - Terreta Hub"}
        </title>
        <meta
          name="description"
          content={
            currentLanguage === "en"
              ? "Chat with Terreta Assistant to get information about Terreta Hub, domains, and projects."
              : "Chatea con el Asistente de Terreta para obtener información sobre Terreta Hub, dominios y proyectos."
          }
        />
      </Helmet>
      
      <div className="min-h-screen bg-white">
        <Navbar currentLanguage={currentLanguage} />
        
        <main className="pt-20 pb-16">
          <ChatbotDomain currentLanguage={currentLanguage} />
        </main>
        
        <DomainChatbot currentLanguage={currentLanguage} />
      </div>
    </>
  );
};

export default ChatbotPage;
