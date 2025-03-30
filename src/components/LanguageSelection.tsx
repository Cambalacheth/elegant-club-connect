
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface LanguageSelectionProps {
  currentLanguage: string;
  setCurrentLanguage?: (language: string) => void;
  isDarkMode?: boolean;
}

const LanguageSelection = ({ 
  currentLanguage, 
  setCurrentLanguage,
  isDarkMode = false 
}: LanguageSelectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLanguageChange = (language: string) => {
    // Save the language preference
    localStorage.setItem("preferredLanguage", language);
    
    // Update state if callback is provided
    if (setCurrentLanguage) {
      setCurrentLanguage(language);
    }
    
    // If we're on the same page, trigger a refresh with the new language
    const currentPath = window.location.pathname;
    const currentSearch = new URLSearchParams(window.location.search);
    currentSearch.set("lang", language);
    
    navigate(`${currentPath}?${currentSearch.toString()}`);
  };

  const handleCustomLanguageSubmit = async (customLanguage: string) => {
    if (customLanguage.trim()) {
      setIsSubmitting(true);
      
      try {
        // Store the custom language request in Supabase
        const { error } = await supabase
          .from('otros_idiomas')
          .insert([{ idioma: customLanguage.trim() }]);
          
        if (error) {
          console.error("Error saving language request:", error);
          throw error;
        }
        
        // Show success toast
        toast({
          title: "Request received",
          description: `Thank you for your interest in "${customLanguage}". We'll consider it for future updates.`,
          variant: "default",
        });
        
      } catch (error) {
        // Show error toast
        toast({
          title: "Error saving",
          description: "An error occurred while saving your request. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className={isDarkMode ? "text-white" : "text-club-brown"}
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => handleLanguageChange("es")}
        >
          <span>Español</span>
          {currentLanguage === "es" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => handleLanguageChange("en")}
        >
          <span>English</span>
          {currentLanguage === "en" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          const language = prompt("Enter the language you're interested in:");
          if (language) handleCustomLanguageSubmit(language);
        }}>
          Request new language
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelection;
