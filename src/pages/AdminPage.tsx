
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { UserRole, canAdminContent } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useForumUser } from "@/hooks/useForumUser";
import UserManagement from "@/components/admin/UserManagement";

const AdminPage = () => {
  const { toast } = useToast();
  const { user, userRole, isLoading } = useForumUser();

  // If the user is not an admin, redirect to the home page
  if (!isLoading && (!user || !canAdminContent(userRole))) {
    toast({
      title: "Acceso denegado",
      description: "No tienes permisos para acceder a esta página",
      variant: "destructive",
    });
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-club-brown mb-6">Panel de Administración</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-orange"></div>
          </div>
        ) : (
          <Tabs defaultValue="users">
            <TabsList className="mb-6">
              <TabsTrigger value="users">Usuarios</TabsTrigger>
              <TabsTrigger value="debates">Debates</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="debates">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Gestión de Debates</h2>
                <p className="text-gray-500">
                  Funcionalidad en desarrollo. Pronto podrás gestionar todos los debates desde aquí.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Estadísticas del Foro</h2>
                <p className="text-gray-500">
                  Funcionalidad en desarrollo. Pronto podrás ver estadísticas detalladas de uso del foro.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
