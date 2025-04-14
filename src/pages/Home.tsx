
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import VerticalsCarousel from "../components/home/VerticalsCarousel";
import CtaSection from "../components/home/CtaSection";
import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
  const location = useLocation();
  const { currentLanguage, setCurrentLanguage } = useLanguage();

  useEffect(() => {
    // Extract language from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const langParam = searchParams.get("lang");
    if (langParam && (langParam === "es" || langParam === "en")) {
      setCurrentLanguage(langParam);
      localStorage.setItem("preferredLanguage", langParam);
      console.log(`Language set to: ${langParam}`);
    } else {
      // Check if there's a language preference in localStorage
      const storedLang = localStorage.getItem("preferredLanguage");
      if (storedLang && (storedLang === "es" || storedLang === "en")) {
        setCurrentLanguage(storedLang);
      }
    }
  }, [location, setCurrentLanguage]);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar currentLanguage={currentLanguage} />
      <AboutSection />
      <VerticalsCarousel language={currentLanguage} />
      <CtaSection language={currentLanguage} />
    </main>
  );
};

export default Home;
