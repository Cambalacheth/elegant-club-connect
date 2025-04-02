
import { User, Settings } from "lucide-react";
import { Profile } from "@/types/profile";
import UserLevelDisplay from "./UserLevelDisplay";
import { getLevelInfo } from "@/types/user";

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
  handleEditProfile: () => void;
  handleSignOut: () => void;
  currentLanguage: string;
  currentUser: any;
}

const ProfileHeader = ({ 
  profile, 
  isOwnProfile, 
  handleEditProfile, 
  handleSignOut, 
  currentLanguage,
  currentUser 
}: ProfileHeaderProps) => {
  const userExperience = profile?.experience || 0;
  const levelInfo = getLevelInfo(userExperience);
  
  return (
    <div className="bg-club-olive/20 p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-club-olive/30 flex items-center justify-center">
          {profile.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={`${profile.username}'s avatar`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={48} className="text-club-brown" />
          )}
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-semibold text-club-brown">{profile.username}</h1>
          {profile.email_visible && (
            <p className="text-club-brown/70 mt-1">
              {isOwnProfile && currentUser ? currentUser.email : null}
            </p>
          )}
          <div className="mt-2">
            <span className="inline-block bg-club-olive/20 px-3 py-1 rounded-full text-sm text-club-brown">
              {profile.gender === "female" ? "Terretiana" : "Terretiano"}
            </span>
          </div>
        </div>
        
        {isOwnProfile && (
          <div className="ml-auto mt-4 md:mt-0">
            <button 
              className="inline-flex items-center gap-2 bg-club-beige px-4 py-2 rounded-md text-club-brown hover:bg-club-beige-dark transition-colors"
              onClick={handleEditProfile}
            >
              <Settings size={18} />
              {currentLanguage === "en" ? "Edit Profile" : "Editar Perfil"}
            </button>
            
            <button 
              onClick={handleSignOut}
              className="ml-3 inline-flex items-center gap-2 bg-club-terracota/10 px-4 py-2 rounded-md text-club-terracota hover:bg-club-terracota/20 transition-colors"
            >
              {currentLanguage === "en" ? "Sign Out" : "Cerrar Sesión"}
            </button>
          </div>
        )}
      </div>
      
      {profile && (
        <div className="mt-4">
          <UserLevelDisplay 
            level={levelInfo.level} 
            experience={userExperience}
            progress={levelInfo.progress}
            nextLevelXP={levelInfo.nextLevelXP}
          />
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
