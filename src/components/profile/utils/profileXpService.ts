
import { supabase } from "@/integrations/supabase/client";

interface ProfileXpMapping {
  action: string;
  description: string;
}

// Map profile fields to action names and XP descriptions
const profileXpMapping: Record<string, ProfileXpMapping> = {
  avatar_url: { 
    action: "profile_update_avatar", 
    description: "Profile: Added Avatar" 
  },
  username: { 
    action: "profile_update_username", 
    description: "Profile: Customized Username" 
  },
  website: { 
    action: "profile_add_website", 
    description: "Profile: Added Website" 
  },
  description: { 
    action: "profile_add_bio", 
    description: "Profile: Added Bio" 
  },
  social_links: { 
    action: "profile_add_socials", 
    description: "Profile: Added Social Networks" 
  },
  speaks_languages: { 
    action: "profile_add_languages", 
    description: "Profile: Added Languages" 
  },
  learning_languages: { 
    action: "profile_add_learning_languages", 
    description: "Profile: Added Learning Languages" 
  }
};

// Fetch the user's XP history for profile changes
export const fetchXpHistory = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from("user_xp_history")
    .select("description")
    .eq("user_id", userId)
    .ilike("description", 'Profile%');
  
  if (error) {
    console.error("Error fetching XP history:", error);
    return [];
  }
  
  return data?.map(item => item.description) || [];
};

// Award XP for a specific profile change if not already awarded
export const awardProfileChangeXp = async (
  userId: string, 
  changeType: string,
  currentLanguage: string
): Promise<{xp: number, message: string}> => {
  if (!profileXpMapping[changeType]) {
    return { xp: 0, message: "" };
  }

  // Get the XP history to check if this change has already been awarded
  const xpHistory = await fetchXpHistory(userId);
  const { action, description } = profileXpMapping[changeType];
  
  // Check if this specific change has already been awarded
  if (xpHistory.some(item => item === description)) {
    return { xp: 0, message: "" }; // Already awarded, no XP
  }
  
  try {
    // Call the backend function to award XP
    const { data, error } = await supabase.rpc(
      'add_user_xp',
      { 
        _user_id: userId, 
        _action_name: action,
        _custom_description: description
      }
    );
    
    if (error) throw error;
    
    // Create localized message for this XP reward
    const messageMap: Record<string, {en: string, es: string}> = {
      avatar_url: { en: "Avatar", es: "Avatar" },
      username: { en: "Username", es: "Nombre de usuario" },
      website: { en: "Website", es: "Sitio web" },
      description: { en: "Bio", es: "Biografía" },
      social_links: { en: "Social Links", es: "Redes Sociales" },
      speaks_languages: { en: "Languages", es: "Idiomas" },
      learning_languages: { en: "Learning Languages", es: "Idiomas Aprendiendo" }
    };
    
    const localizedName = messageMap[changeType] 
      ? (currentLanguage === "en" ? messageMap[changeType].en : messageMap[changeType].es)
      : changeType;
      
    const xpValue = data || 0;
    return {
      xp: xpValue,
      message: xpValue > 0 ? `+${xpValue} XP (${localizedName})` : ""
    };
    
  } catch (error) {
    console.error(`Error awarding XP for ${changeType}:`, error);
    return { xp: 0, message: "" };
  }
};

// Check for changes that deserve XP rewards
export const processProfileChanges = async (
  userId: string,
  values: any,
  avatarUrl: string | null,
  socialLinks: { id?: string; platform: string; url: string }[],
  currentProfile: any,
  currentLanguage: string
): Promise<{totalXp: number, messages: string[]}> => {
  let totalXpEarned = 0;
  let xpEarnedMessages: string[] = [];

  // Check for avatar change
  if (avatarUrl && !currentProfile.avatar_url) {
    const result = await awardProfileChangeXp(userId, "avatar_url", currentLanguage);
    if (result.xp > 0) {
      totalXpEarned += result.xp;
      xpEarnedMessages.push(result.message);
    }
  }

  // Check for username change (if not default from email)
  const usernameFromEmail = currentProfile.email?.split('@')[0];
  if (values.username && values.username !== usernameFromEmail && values.username !== currentProfile.username) {
    const result = await awardProfileChangeXp(userId, "username", currentLanguage);
    if (result.xp > 0) {
      totalXpEarned += result.xp;
      xpEarnedMessages.push(result.message);
    }
  }

  // Check for website
  if (values.website && values.website.trim() !== '' && !currentProfile.website) {
    const result = await awardProfileChangeXp(userId, "website", currentLanguage);
    if (result.xp > 0) {
      totalXpEarned += result.xp;
      xpEarnedMessages.push(result.message);
    }
  }

  // Check for description
  if (values.description && values.description.trim() !== '' && !currentProfile.description) {
    const result = await awardProfileChangeXp(userId, "description", currentLanguage);
    if (result.xp > 0) {
      totalXpEarned += result.xp;
      xpEarnedMessages.push(result.message);
    }
  }
  
  // Check for social links
  const validSocialLinks = socialLinks.filter(link => link.url && link.url.trim() !== '');
  if (validSocialLinks.length > 0) {
    const result = await awardProfileChangeXp(userId, "social_links", currentLanguage);
    if (result.xp > 0) {
      totalXpEarned += result.xp;
      xpEarnedMessages.push(result.message);
    }
  }
  
  // Check for languages
  if (values.speaks_languages && Array.isArray(values.speaks_languages) && values.speaks_languages.length > 0) {
    const result = await awardProfileChangeXp(userId, "speaks_languages", currentLanguage);
    if (result.xp > 0) {
      totalXpEarned += result.xp;
      xpEarnedMessages.push(result.message);
    }
  }
  
  if (values.learning_languages && Array.isArray(values.learning_languages) && values.learning_languages.length > 0) {
    const result = await awardProfileChangeXp(userId, "learning_languages", currentLanguage);
    if (result.xp > 0) {
      totalXpEarned += result.xp;
      xpEarnedMessages.push(result.message);
    }
  }

  return { totalXp: totalXpEarned, messages: xpEarnedMessages };
};
