
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import VerticalsCarousel from "../components/home/VerticalsCarousel";
import CtaSection from "../components/home/CtaSection";

const Home = () => {
  const location = useLocation();
  const [language, setLanguage] = useState("es"); // Default to Spanish

  useEffect(() => {
    // Extract language from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const langParam = searchParams.get("lang");
    if (langParam && (langParam === "es" || langParam === "en")) {
      setLanguage(langParam);
      console.log(`Language set to: ${langParam}`);
    }
  }, [location]);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar currentLanguage={language} />
      <AboutSection />
      <VerticalsCarousel />
      <CtaSection language={language} />
    </main>
  );
};

export default Home;
