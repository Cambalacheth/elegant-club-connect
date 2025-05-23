import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Events from "./pages/Events";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import UserProfile from "./pages/UserProfile";
import MeRedirect from "./components/MeRedirect";
import NotFound from "./pages/NotFound";
import Members from "./pages/Members";
import ForumPage from "./pages/ForumPage";
import DebateDetailPage from "./pages/DebateDetailPage";
import AdminPage from "./pages/AdminPage";
import AsadoRegistration from "./pages/AsadoRegistration";
import SearchPage from './pages/SearchPage';
import EventDetail from "./pages/EventDetail";
import ProjectDetail from "./pages/ProjectDetail";
import DomainPage from "./pages/DomainPage";
import VerticalDomainPage from "./pages/VerticalDomainPage";
import VerticalPage from "./pages/VerticalPage";
import ElFotographerPage from "./pages/ElFotographerPage";
import Feedback from "./pages/Feedback";
import VotePage from "./pages/VotePage";
import InfluencersPage from "./pages/InfluencersPage";
import ChatbotPage from "./pages/ChatbotPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Set shorter stale time and retry configuration for better UX
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <HelmetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/index" element={<Navigate replace to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                
                {/* Remove routes for /recursos and redirect any access to home */}
                <Route path="/recursos" element={<Navigate replace to="/home" />} />
                <Route path="/recursos/:type/:id" element={<Navigate replace to="/home" />} />
                
                {/* Remove routes for /content and redirect any access to home */}
                <Route path="/content" element={<Navigate replace to="/home" />} />
                <Route path="/content/:type/:id" element={<Navigate replace to="/home" />} />
                
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/user/me" element={<MeRedirect />} />
                <Route path="/user/:username" element={<UserProfile />} />
                <Route path="/members" element={<Members />} />
                <Route path="/forum" element={<ForumPage />} />
                <Route path="/forum/:id" element={<DebateDetailPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/asado" element={<AsadoRegistration />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/dominio" element={<DomainPage />} />
                <Route path="/ElFotographer" element={<ElFotographerPage />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/vote" element={<VotePage />} />
                <Route path="/influencers" element={<InfluencersPage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
                
                {/* Vertical pages with dedicated routes */}
                <Route path="/legal" element={<VerticalPage />} />
                <Route path="/arte" element={<VerticalPage />} />
                <Route path="/negocios" element={<VerticalPage />} />
                <Route path="/salud" element={<VerticalPage />} />
                <Route path="/comunidad" element={<VerticalPage />} />
                <Route path="/tech" element={<VerticalPage />} />
                
                {/* Generic route for any domain that might be tagged with hashtag */}
                <Route path="/:domainName" element={<DomainPage />} />
                
                {/* Only keep the forum redirects for backward compatibility */}
                <Route path="/*/foro" element={<Navigate replace to="/forum" />} />
                <Route path="/*/foro/:id" element={<Navigate replace to="/forum/:id" />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </HelmetProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
