
export type UserLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface User {
  id: string;
  username: string;
  level: UserLevel;
  experience: number;
  avatar_url?: string | null;
  category?: string | null;
}

export const canCreateContent = (level: UserLevel): boolean => {
  return level >= 2;
};

export const canModerateContent = (level: UserLevel): boolean => {
  return level >= 8;
};

export const canManageContent = (level: UserLevel): boolean => {
  return level >= 10;
};

export const canAdminContent = (level: UserLevel): boolean => {
  return level === 13;
};

export const LEVEL_THRESHOLDS = [
  0,      // Level 1: 0 XP (starting level)
  100,    // Level 2: 100 XP
  300,    // Level 3: 300 XP
  600,    // Level 4: 600 XP
  1000,   // Level 5: 1000 XP
  1500,   // Level 6: 1500 XP
  2200,   // Level 7: 2200 XP
  3000,   // Level 8: 3000 XP (can moderate)
  4000,   // Level 9: 4000 XP
  5500,   // Level 10: 5500 XP (can manage)
  7500,   // Level 11: 7500 XP
  10000,  // Level 12: 10000 XP (max regular level)
  Infinity // Level 13: Admin only
];

export const getLevelInfo = (xp: number): { level: UserLevel, currentXP: number, nextLevelXP: number, progress: number } => {
  let level = 1;
  
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = (i + 1) as UserLevel;
    } else {
      break;
    }
  }
  
  const currentLevelIndex = level - 1;
  const currentLevelXP = LEVEL_THRESHOLDS[currentLevelIndex];
  const nextLevelXP = level < 13 ? LEVEL_THRESHOLDS[currentLevelIndex + 1] : Infinity;
  
  const xpInCurrentLevel = xp - currentLevelXP;
  const xpRequiredForNextLevel = nextLevelXP - currentLevelXP;
  const progress = xpRequiredForNextLevel > 0 ? Math.min(100, (xpInCurrentLevel / xpRequiredForNextLevel) * 100) : 100;
  
  return {
    level,
    currentXP: xp,
    nextLevelXP,
    progress
  };
};

export const LEVEL_NAMES = {
  1: "Novato",
  2: "Iniciado", 
  3: "Aprendiz",
  4: "Aficionado",
  5: "Explorador",
  6: "Artesano",
  7: "Especialista", 
  8: "Experto",
  9: "Maestro",
  10: "Sabio",
  11: "Virtuoso",
  12: "Leyenda",
  13: "Admin"
};

export const getLevelName = (level: UserLevel): string => {
  return LEVEL_NAMES[level] || "Desconocido";
};
