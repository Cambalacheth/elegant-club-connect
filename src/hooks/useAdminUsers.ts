
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";

export const useAdminUsers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { 
    data: users, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, level_numeric, experience")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios",
          variant: "destructive",
        });
        throw error;
      }

      return data.map(profile => ({
        ...profile,
        experience: typeof profile.experience === 'number' ? profile.experience : 0,
        level: typeof profile.level_numeric === 'number' ? profile.level_numeric : 1
      })) as Profile[];
    },
  });

  const filteredUsers = users?.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    users: filteredUsers,
    isLoading,
    refetch,
    searchTerm,
    setSearchTerm
  };
};

export default useAdminUsers;
