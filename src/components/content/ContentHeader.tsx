
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { canContribute } from "@/types/user";
import { useUser } from "@/hooks/useUser";
import { UserRole } from "@/types/user";

interface ContentHeaderProps {
  title: string;
  description?: string;
  onAddContent?: () => void;
  showAddButton?: boolean;
}

const ContentHeader = ({
  title,
  description,
  onAddContent,
  showAddButton = true,
}: ContentHeaderProps) => {
  const { userRole } = useUser();
  
  const canAdd = canContribute(userRole as UserRole);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-club-brown mb-2">{title}</h1>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
        
        {showAddButton && canAdd && onAddContent && (
          <Button 
            onClick={onAddContent}
            className="bg-club-terracotta hover:bg-club-brown text-white font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
            size="lg"
          >
            <PlusCircle size={20} />
            <span>Añadir recurso</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContentHeader;
