
import { Progress } from "@/components/ui/progress";
import { UserLevel, getLevelName } from "@/types/user";

interface UserLevelDisplayProps {
  level: UserLevel;
  experience: number;
  progress: number;
  nextLevelXP?: number;
  compact?: boolean;
}

const UserLevelDisplay = ({
  level,
  experience,
  progress,
  nextLevelXP,
  compact = false
}: UserLevelDisplayProps) => {
  const levelName = getLevelName(level);
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-club-orange/20 text-club-orange text-xs font-medium px-2 py-1 rounded-full">
          Nivel {level}
        </div>
        <span className="text-xs text-gray-600">{levelName}</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-club-orange text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
            {level}
          </span>
          <span className="font-medium text-club-brown">{levelName}</span>
        </div>
        
        <span className="text-sm text-gray-600">
          {experience} XP
          {nextLevelXP !== Infinity && nextLevelXP !== undefined && (
            <> / {nextLevelXP} XP</>
          )}
        </span>
      </div>
      
      {level < 13 && (
        <>
          <Progress value={progress} className="h-2 bg-gray-200" 
            indicatorClassName="bg-gradient-to-r from-club-orange to-club-terracotta" />
          <div className="text-xs text-gray-500 text-right">
            {Math.round(progress)}% completado
          </div>
        </>
      )}
    </div>
  );
};

export default UserLevelDisplay;
