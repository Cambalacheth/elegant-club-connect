import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Content from "./pages/Content";
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
import ContentDetail from "./pages/ContentDetail";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/content" element={<Content />} />
            <Route path="/content/:type/:id" element={<ContentDetail />} />
            <Route path="/events" element={<Events />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
