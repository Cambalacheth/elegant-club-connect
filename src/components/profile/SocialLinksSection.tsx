
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SocialPlatform, socialPlatformLabels } from "@/types/profile";

interface SocialLink {
  id?: string;
  platform: string;
  url: string;
}

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
  setSocialLinks: (links: SocialLink[]) => void;
  availablePlatforms: SocialPlatform[];
  setAvailablePlatforms: (platforms: SocialPlatform[]) => void;
  currentLanguage: string;
}

const SocialLinksSection = ({
  socialLinks,
  setSocialLinks,
  availablePlatforms,
  setAvailablePlatforms,
  currentLanguage
}: SocialLinksSectionProps) => {
  const texts = {
    socialLinksLabel: currentLanguage === "en" ? "Social Links" : "Enlaces Sociales",
    addSocialLink: currentLanguage === "en" ? "Add Social Link" : "Añadir Enlace Social",
    platformLabel: currentLanguage === "en" ? "Platform" : "Plataforma",
    urlLabel: currentLanguage === "en" ? "Username" : "Nombre de Usuario",
    selectPlatform: currentLanguage === "en" ? "Select platform" : "Seleccionar plataforma",
  };

  const handleAddSocialLink = () => {
    if (availablePlatforms.length === 0) return;

    setSocialLinks([
      ...socialLinks,
      {
        platform: availablePlatforms[0],
        url: "",
      },
    ]);

    setAvailablePlatforms((prev) => prev.filter((p) => p !== availablePlatforms[0]));
  };

  const handleRemoveSocialLink = (index: number) => {
    const linkToRemove = socialLinks[index];
    
    if (availablePlatforms.indexOf(linkToRemove.platform as SocialPlatform) === -1) {
      setAvailablePlatforms((prev) => [...prev, linkToRemove.platform as SocialPlatform]);
    }
    
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  const handleSocialLinkChange = (index: number, field: "platform" | "url", value: string) => {
    const newLinks = [...socialLinks];
    
    if (field === "platform") {
      const oldPlatform = newLinks[index].platform as SocialPlatform;
      
      if (availablePlatforms.indexOf(oldPlatform) === -1) {
        setAvailablePlatforms((prev) => [...prev, oldPlatform]);
      }
      
      setAvailablePlatforms((prev) => prev.filter((p) => p !== value));
    }
    
    if (field === "url" && value.startsWith("http")) {
      if (newLinks[index].platform === "instagram" && value.includes("instagram.com/")) {
        value = value.split("instagram.com/")[1].split("/")[0].split("?")[0];
      } else if (newLinks[index].platform === "twitter" && value.includes("twitter.com/")) {
        value = value.split("twitter.com/")[1].split("/")[0].split("?")[0];
      } else if (newLinks[index].platform === "github" && value.includes("github.com/")) {
        value = value.split("github.com/")[1].split("/")[0].split("?")[0];
      } else if (newLinks[index].platform === "linkedin" && value.includes("linkedin.com/in/")) {
        value = value.split("linkedin.com/in/")[1].split("/")[0].split("?")[0];
      } else if (newLinks[index].platform === "youtube" && value.includes("youtube.com/")) {
        value = value.includes("youtube.com/@") 
          ? value.split("youtube.com/@")[1].split("/")[0].split("?")[0]
          : value.split("youtube.com/")[1].split("/")[0].split("?")[0];
      } else if (newLinks[index].platform === "tiktok" && value.includes("tiktok.com/")) {
        value = value.includes("tiktok.com/@") 
          ? value.split("tiktok.com/@")[1].split("/")[0].split("?")[0]
          : value.split("tiktok.com/")[1].split("/")[0].split("?")[0];
      }
    }
    
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>{texts.socialLinksLabel}</FormLabel>
        {availablePlatforms.length > 0 && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddSocialLink}
          >
            <Plus className="mr-2 h-4 w-4" /> {texts.addSocialLink}
          </Button>
        )}
      </div>

      {socialLinks.map((link, index) => (
        <div
          key={index}
          className="space-y-2 border p-4 rounded-md"
        >
          <div className="grid grid-cols-[1fr_2fr_auto] gap-3 items-start">
            <div>
              <FormLabel>{texts.platformLabel}</FormLabel>
              <Select
                value={link.platform}
                onValueChange={(value) =>
                  handleSocialLinkChange(index, "platform", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={texts.selectPlatform} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={link.platform}>
                    {socialPlatformLabels[link.platform as SocialPlatform][
                      currentLanguage === "en" ? "en" : "es"
                    ]}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <FormLabel>{texts.urlLabel}</FormLabel>
              <Input
                value={link.url}
                onChange={(e) =>
                  handleSocialLinkChange(index, "url", e.target.value)
                }
                placeholder={
                  link.platform === "instagram" ? "username" :
                  link.platform === "twitter" ? "username" :
                  link.platform === "github" ? "username" :
                  link.platform === "linkedin" ? "username" :
                  link.platform === "youtube" ? "@channel" :
                  link.platform === "tiktok" ? "@username" :
                  link.platform === "spotify" ? "username" :
                  link.platform === "website" ? "example.com" :
                  link.platform === "email" ? "you@example.com" : ""
                }
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-8"
              onClick={() => handleRemoveSocialLink(index)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialLinksSection;
