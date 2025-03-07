
import { Profile } from "@/types/profile";

interface ProfileAboutProps {
  profile: Profile;
  currentLanguage: string;
  getCategoryTranslation: (category: string) => string;
}

const ProfileAbout = ({ profile, currentLanguage, getCategoryTranslation }: ProfileAboutProps) => {
  if (!profile.description && (!profile.categories || profile.categories.length === 0)) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      {profile.description && (
        <div>
          <h2 className="text-xl font-semibold text-club-brown mb-4">
            {currentLanguage === "en" ? "About" : "Acerca de"}
          </h2>
          <div className="bg-club-beige/40 p-6 rounded-lg">
            <p className="text-club-brown whitespace-pre-line">{profile.description}</p>
          </div>
        </div>
      )}
      
      {profile.categories && profile.categories.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-club-brown mb-4">
            {currentLanguage === "en" ? "Interests" : "Intereses"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.categories.map((category, index) => (
              <span 
                key={index}
                className="bg-club-olive/20 px-3 py-1 rounded-full text-sm text-club-brown"
              >
                {getCategoryTranslation(category)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAbout;
