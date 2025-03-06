
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import VerticalsSection from "../components/VerticalsSection";
import EventsSection from "../components/EventsSection";
import Footer from "../components/Footer";

const Home = () => {
  const location = useLocation();
  const [language, setLanguage] = useState("es"); // Default to Spanish

  useEffect(() => {
    // Extract language from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const langParam = searchParams.get("lang");
    if (langParam && (langParam === "es" || langParam === "en")) {
      setLanguage(langParam);
      // In a real app, you would update your i18n context/store here
      console.log(`Language set to: ${langParam}`);
    }
  }, [location]);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar currentLanguage={language} />
      <AboutSection />
      <VerticalsSection />
      <EventsSection />
      <Footer />
    </main>
  );
};

export default Home;
