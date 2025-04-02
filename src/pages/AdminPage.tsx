
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import NavbarWithDefaultLang from "@/components/Navbar";
import UserManagement from "@/components/admin/UserManagement";
import { ContentManagement } from "@/components/content/ContentManagement";
import { EventManagement } from "@/components/events/EventManagement";
import FeedbackManagement from "@/components/admin/FeedbackManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/useUser";
import { canAdminContent } from "@/types/user";
import { Navigate } from "react-router-dom";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const { user, userRole, isLoading } = useUser();

  // Redirect if user isn't admin
  if (!isLoading && (!user || !canAdminContent(userRole))) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-club-brown"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin | Terreta Hub</title>
      </Helmet>

      <div className="min-h-screen bg-club-beige-light">
        <NavbarWithDefaultLang />
        
        <main className="container mx-auto pt-24 pb-16 px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-club-brown mb-6">
            Panel de Administración
          </h1>

          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="users">Usuarios</TabsTrigger>
              <TabsTrigger value="content">Contenido</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="content">
              {user && userRole === 'admin' && (
                <ContentManagement userId={user.id} userRole={userRole} />
              )}
            </TabsContent>
            
            <TabsContent value="events">
              <EventManagement />
            </TabsContent>
            
            <TabsContent value="feedback">
              <FeedbackManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default AdminPage;
