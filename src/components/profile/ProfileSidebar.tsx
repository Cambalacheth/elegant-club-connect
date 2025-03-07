
import { Instagram, Twitter, Github, Linkedin, Music, Youtube, Video, Link as LinkIcon, Mail } from "lucide-react";
import { Profile, SocialLink } from "@/types/profile";

interface ProfileSidebarProps {
  profile: Profile;
  socialLinks: SocialLink[];
  currentLanguage: string;
  currentUser: any;
}

const ProfileSidebar = ({ profile, socialLinks, currentLanguage, currentUser }: ProfileSidebarProps) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram": return <Instagram size={20} className="text-club-brown" />;
      case "twitter": return <Twitter size={20} className="text-club-brown" />;
      case "github": return <Github size={20} className="text-club-brown" />;
      case "linkedin": return <Linkedin size={20} className="text-club-brown" />;
      case "spotify": return <Music size={20} className="text-club-brown" />;
      case "youtube": return <Youtube size={20} className="text-club-brown" />;
      case "tiktok": return <Video size={20} className="text-club-brown" />;
      case "website": return <LinkIcon size={20} className="text-club-brown" />;
      case "email": return <Mail size={20} className="text-club-brown" />;
      default: return <LinkIcon size={20} className="text-club-brown" />;
    }
  };

  const hasLinks = profile.website || socialLinks.length > 0 || profile.email_visible;

  return (
    <div className="space-y-6">
      {hasLinks && (
        <div>
          <h2 className="text-xl font-semibold text-club-brown mb-4">
            {currentLanguage === "en" ? "Links" : "Enlaces"}
          </h2>
          <div className="bg-club-beige/40 p-6 rounded-lg space-y-3">
            {profile.website && (
              <a 
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-club-brown hover:text-club-terracota transition-colors py-1"
              >
                <LinkIcon size={20} />
                <span className="truncate">{profile.website}</span>
              </a>
            )}
            
            {profile.email_visible && currentUser && (
              <a 
                href={`mailto:${currentUser.email}`}
                className="flex items-center gap-3 text-club-brown hover:text-club-terracota transition-colors py-1"
              >
                <Mail size={20} />
                <span className="truncate">{currentUser.email}</span>
              </a>
            )}
            
            {socialLinks.map((link) => (
              <a 
                key={link.id}
                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-club-brown hover:text-club-terracota transition-colors py-1"
              >
                {getSocialIcon(link.platform)}
                <span className="truncate">
                  {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-semibold text-club-brown mb-4">
          {currentLanguage === "en" ? "Member Since" : "Miembro desde"}
        </h2>
        <div className="bg-club-beige/40 p-6 rounded-lg">
          <p className="text-club-brown">
            {new Date(profile.created_at).toLocaleDateString(
              currentLanguage === "en" ? "en-US" : "es-ES",
              { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
