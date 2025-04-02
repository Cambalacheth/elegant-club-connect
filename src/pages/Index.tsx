
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // On initial render, check if we're at the root path
    if (window.location.pathname === '/') {
      // Smooth scroll functionality for anchor links
      const handleAnchorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A') {
          const href = target.getAttribute('href');
          if (href && href.startsWith('#') && href !== '#') {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
              element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }
          }
        }
      };

      document.addEventListener('click', handleAnchorClick);
      return () => document.removeEventListener('click', handleAnchorClick);
    } else {
      // If we're explicitly at /Index (not just root), redirect to /home
      if (window.location.pathname === '/Index') {
        navigate('/home');
      }
    }
  }, [navigate]);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <HeroSection />
    </main>
  );
};

export default Index;
