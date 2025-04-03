
import React from 'react';

interface UserAvatarProps {
  username: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar = ({ username, avatarUrl, size = 'md' }: UserAvatarProps) => {
  // Size mapping
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };
  
  const containerClass = `${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`;
  
  return (
    <div className={containerClass}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={`${username}'s avatar`} className={`${sizeClasses[size]} object-cover`} />
      ) : (
        <span className="text-xs font-medium">{username?.charAt(0).toUpperCase() || 'U'}</span>
      )}
    </div>
  );
};

export default UserAvatar;
