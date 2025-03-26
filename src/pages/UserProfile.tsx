
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAbout from "@/components/profile/ProfileAbout";
import ProfileProjects from "@/components/profile/ProfileProjects";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { useProfileData } from "@/hooks/useProfileData";
import { getCategoryTranslation } from "@/utils/translations";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "@/components/auth/InfoIcon";

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<string>("es");
  
  useEffect(() => {
    const storedLanguage = localStorage.getItem("preferredLanguage");
    if (storedLanguage) {
      setCurrentLanguage(storedLanguage);
    }
  }, []);

  const {
    profile,
    socialLinks,
    projects,
    currentUser,
    isOwnProfile,
    loading,
    isEditing,
    handleSignOut,
    handleEditProfile,
    handleCancelEdit
  } = useProfileData(username, currentLanguage);

  const translateCategory = (category: string) => getCategoryTranslation(category, currentLanguage);

  // SEO title and description
  const pageTitle = profile 
    ? `${profile.username} - ${currentLanguage === "en" ? "Profile" : "Perfil"} | Terreta Hub` 
    : currentLanguage === "en" ? "Profile | Terreta Hub" : "Perfil | Terreta Hub";
  
  const pageDescription = profile 
    ? `${profile.description?.substring(0, 160) || (currentLanguage === "en" ? `${profile.username}'s profile` : `Perfil de ${profile.username}`)}` 
    : currentLanguage === "en" ? "View member profiles on Terreta Hub" : "Ver perfiles de miembros en Terreta Hub";

  if (loading) {
    return (
      <div className="min-h-screen bg-club-beige">
        <Helmet>
          <title>{currentLanguage === "en" ? "Loading Profile | Terreta Hub" : "Cargando Perfil | Terreta Hub"}</title>
          <meta name="description" content={currentLanguage === "en" ? "Loading profile information..." : "Cargando información del perfil..."} />
        </Helmet>
        <Navbar currentLanguage={currentLanguage} />
        <ProfileSkeleton currentLanguage={currentLanguage} />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-club-beige">
        <Helmet>
          <title>{currentLanguage === "en" ? "Profile Not Found | Terreta Hub" : "Perfil No Encontrado | Terreta Hub"}</title>
          <meta name="description" content={currentLanguage === "en" ? "The requested profile could not be found." : "El perfil solicitado no pudo ser encontrado."} />
        </Helmet>
        <Navbar currentLanguage={currentLanguage} />
        <main className="container mx-auto px-6 pt-32 pb-16">
          <div className="flex justify-center items-center h-64 flex-col gap-4">
            <Alert variant="destructive" className="max-w-md">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>
                {currentLanguage === "en" ? "Profile not found" : "Perfil no encontrado"}
              </AlertTitle>
              <AlertDescription>
                {currentLanguage === "en" 
                  ? "The requested profile could not be found." 
                  : "El perfil solicitado no pudo ser encontrado."}
              </AlertDescription>
            </Alert>
            <button 
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-club-orange rounded-md text-white hover:bg-club-terracota transition-colors"
            >
              {currentLanguage === "en" ? "Return to Home" : "Volver al Inicio"}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-club-beige">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {profile.avatar_url && <meta property="og:image" content={profile.avatar_url} />}
        <meta property="og:type" content="profile" />
        <meta property="profile:username" content={profile.username} />
        {profile.categories && profile.categories.length > 0 && (
          <meta name="keywords" content={profile.categories.join(', ')} />
        )}
        <link rel="canonical" href={`${window.location.origin}/user/${username}`} />
      </Helmet>
      
      <Navbar currentLanguage={currentLanguage} />
      
      <main className="container mx-auto px-6 pt-32 pb-16">
        <nav aria-label="breadcrumb" className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-club-brown hover:text-club-terracota transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>{currentLanguage === "en" ? "Back" : "Volver"}</span>
          </button>
        </nav>

        {isEditing ? (
          <section aria-labelledby="edit-profile-heading">
            <h1 id="edit-profile-heading" className="sr-only">
              {currentLanguage === "en" ? "Edit Profile" : "Editar Perfil"}
            </h1>
            <ProfileForm 
              userId={profile.id} 
              currentLanguage={currentLanguage} 
              onCancel={handleCancelEdit} 
            />
          </section>
        ) : (
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <ProfileHeader 
              profile={profile}
              isOwnProfile={isOwnProfile}
              handleEditProfile={handleEditProfile}
              handleSignOut={handleSignOut}
              currentLanguage={currentLanguage}
              currentUser={currentUser}
            />
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <ProfileAbout 
                    profile={profile}
                    currentLanguage={currentLanguage}
                    getCategoryTranslation={translateCategory}
                  />
                  
                  <ProfileProjects 
                    projects={projects}
                    currentLanguage={currentLanguage}
                    getCategoryTranslation={translateCategory}
                  />
                </div>
                
                <ProfileSidebar 
                  profile={profile}
                  socialLinks={socialLinks}
                  currentLanguage={currentLanguage}
                  currentUser={currentUser}
                />
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
