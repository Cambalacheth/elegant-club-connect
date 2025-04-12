
export type UserLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

// For backward compatibility with components that expect the old role system
export type UserRole = "registered" | "verified" | "moderator" | "admin";

export interface User {
  id: string;
  username: string;
  level: UserLevel;
  experience: number;
  avatar_url?: string | null;
  category?: string | null;
}

export const canCreateContent = (level: UserLevel | UserRole): boolean => {
  if (typeof level === 'string') {
    // Convert UserRole to UserLevel for backward compatibility
    return ['verified', 'moderator', 'admin'].includes(level);
  }
  return level >= 5; // Changed from 2 to 5 - Level 5+ can create content
};

export const canCreateForum = (level: UserLevel | UserRole): boolean => {
  if (typeof level === 'string') {
    // Convert UserRole to UserLevel based on previous implementation
    return ['moderator', 'admin'].includes(level);
  }
  return level >= 4; // Level 4+ can create forum posts
};

export const canModerateContent = (level: UserLevel | UserRole): boolean => {
  if (typeof level === 'string') {
    // Convert UserRole to UserLevel
    return ['moderator', 'admin'].includes(level);
  }
  return level >= 8;
};

export const canManageContent = (level: UserLevel | UserRole): boolean => {
  if (typeof level === 'string') {
    // Convert UserRole to UserLevel
    return level === 'admin';
  }
  return level >= 10;
};

export const canAdminContent = (level: UserLevel | UserRole): boolean => {
  if (typeof level === 'string') {
    // Convert UserRole to UserLevel
    return level === 'admin';
  }
  return level === 13;
};

export const canParticipateInInfluencerProgram = (level: UserLevel | UserRole): boolean => {
  if (typeof level === 'string') {
    // Any registered user can participate
    return true;
  }
  return level >= 1; // Any registered user can participate
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
  999999  // Level 13: Admin only (cambiado de Infinity a 999999)
];

export const getLevelInfo = (xp: number): { level: UserLevel, currentXP: number, nextLevelXP: number, progress: number } => {
  let level = 1 as UserLevel;
  
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = (i + 1) as UserLevel;
    } else {
      break;
    }
  }
  
  const currentLevelIndex = level - 1;
  const currentLevelXP = LEVEL_THRESHOLDS[currentLevelIndex];
  const nextLevelXP = level < 13 ? LEVEL_THRESHOLDS[currentLevelIndex + 1] : 999999;
  
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

// Helper to convert UserRole to UserLevel for backward compatibility
export const roleToLevel = (role: UserRole): UserLevel => {
  switch (role) {
    case 'admin': return 13 as UserLevel;
    case 'moderator': return 8 as UserLevel;
    case 'verified': return 2 as UserLevel;
    default: return 1 as UserLevel;
  }
};

// Helper to convert UserLevel to UserRole for backward compatibility
export const levelToRole = (level: UserLevel): UserRole => {
  if (level >= 13) return 'admin';
  if (level >= 8) return 'moderator';
  if (level >= 2) return 'verified';
  return 'registered';
};
