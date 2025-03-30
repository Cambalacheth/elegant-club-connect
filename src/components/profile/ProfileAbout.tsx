
import { Profile } from "@/types/profile";
import { Calendar, MapPin, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileAboutProps {
  profile: Profile;
  currentLanguage: string;
  getCategoryTranslation: (category: string) => string;
}

const ProfileAbout = ({ profile, currentLanguage, getCategoryTranslation }: ProfileAboutProps) => {
  const aboutText = currentLanguage === "en" ? "About" : "Acerca de";
  const categoriesText = currentLanguage === "en" ? "Areas of interest" : "Áreas de interés";
  const joinedText = currentLanguage === "en" ? "Joined" : "Se unió el";
  const websiteText = currentLanguage === "en" ? "Website" : "Sitio web";
  const noDescriptionText = currentLanguage === "en" 
    ? "This user has not added a description yet." 
    : "Este usuario aún no ha añadido una descripción.";
  const noCategoriesText = currentLanguage === "en" 
    ? "No areas of interest specified." 
    : "No se han especificado áreas de interés.";
  const languagesText = currentLanguage === "en" ? "Languages" : "Idiomas";
  const speaksText = currentLanguage === "en" ? "Speaks" : "Habla";
  const learningText = currentLanguage === "en" ? "Learning" : "Aprendiendo";
  const preferredLanguageText = currentLanguage === "en" ? "Preferred language" : "Idioma preferido";
  
  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      es: "Español",
      en: "English",
      fr: "Français",
      de: "Deutsch",
      it: "Italiano",
      pt: "Português",
      ca: "Català",
    };
    return languages[code] || code;
  };
  
  const formattedDate = new Date(profile.created_at).toLocaleDateString(
    currentLanguage === "en" ? "en-US" : "es-ES",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <section aria-labelledby="about-heading">
      <h2 id="about-heading" className="text-2xl font-medium text-club-brown mb-4">
        {aboutText}
      </h2>
      
      <div className="space-y-6">
        <div>
          <p className="text-club-brown/80">
            {profile.description || noDescriptionText}
          </p>
        </div>
        
        {(profile.categories && profile.categories.length > 0) && (
          <div>
            <h3 className="text-lg font-medium text-club-brown mb-2">{categoriesText}</h3>
            <div className="flex flex-wrap gap-2">
              {profile.categories.map((category) => (
                <Badge key={category} variant="outline" className="bg-white">
                  <Tag className="h-3 w-3 mr-1 text-club-olive" />
                  {getCategoryTranslation(category)}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {(profile.preferred_language || 
          (profile.speaks_languages && profile.speaks_languages.length > 0) || 
          (profile.learning_languages && profile.learning_languages.length > 0)) && (
          <div>
            <h3 className="text-lg font-medium text-club-brown mb-2">{languagesText}</h3>
            <div className="space-y-2">
              {profile.preferred_language && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-club-brown">{preferredLanguageText}:</span>
                  <Badge variant="secondary">{getLanguageName(profile.preferred_language)}</Badge>
                </div>
              )}
              
              {profile.speaks_languages && profile.speaks_languages.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-club-brown">{speaksText}:</span>
                  {profile.speaks_languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="bg-white">
                      {getLanguageName(lang)}
                    </Badge>
                  ))}
                </div>
              )}
              
              {profile.learning_languages && profile.learning_languages.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-club-brown">{learningText}:</span>
                  {profile.learning_languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="bg-white/50">
                      {getLanguageName(lang)}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 text-sm text-club-brown/70">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {joinedText} {formattedDate}
            </span>
          </div>
          
          {profile.website && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <a 
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-club-orange transition-colors"
              >
                {websiteText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileAbout;
