
export type UserRole = 'registered' | 'verified' | 'moderator' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  avatar_url?: string | null;
  category?: string | null;
}

export const canCreateContent = (role: UserRole): boolean => {
  return ['verified', 'moderator', 'admin'].includes(role);
};

export const canModerateContent = (role: UserRole): boolean => {
  return ['moderator', 'admin'].includes(role);
};

export const canManageContent = (role: UserRole): boolean => {
  return ['moderator', 'admin'].includes(role);
};

export const canAdminContent = (role: UserRole): boolean => {
  return role === 'admin';
};
