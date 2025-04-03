
import { Profile } from "@/types/profile";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  selectedUser: Profile | null;
  onLevelChange: (user: Profile) => void;
  onAddXP: (user: Profile, amount: number, description: string) => void;
}

const QuickActions = ({ selectedUser, onLevelChange, onAddXP }: QuickActionsProps) => {
  return (
    <div className="mb-4 space-y-2">
      <h3 className="text-lg font-medium">Acciones rápidas</h3>
      <div className="flex flex-wrap gap-3">
        <Button 
          variant="outline" 
          className="border-club-beige text-club-brown"
          onClick={() => selectedUser && onLevelChange(selectedUser)}
          disabled={!selectedUser}
        >
          Cambiar nivel directamente
        </Button>
        <Button 
          variant="outline" 
          className="border-club-beige text-club-brown"
          onClick={() => {
            if (selectedUser) {
              onAddXP(selectedUser, 100, "Bonificación manual");
            }
          }}
          disabled={!selectedUser}
        >
          +100 XP
        </Button>
        <Button 
          variant="outline" 
          className="border-red-200 text-red-600"
          onClick={() => {
            if (selectedUser) {
              onAddXP(selectedUser, -50, "Penalización manual");
            }
          }}
          disabled={!selectedUser}
        >
          -50 XP
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
