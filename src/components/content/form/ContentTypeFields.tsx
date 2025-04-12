
import { ContentType } from "@/types/content";
import { UseFormReturn } from "react-hook-form";
import { ArticleFields } from "./content-types/ArticleFields";
import { VideoFields } from "./content-types/VideoFields";
import { GuideFields } from "./content-types/GuideFields";
import { ResourceFields } from "./content-types/resource/ResourceFields";

interface ContentTypeFieldsProps {
  form: UseFormReturn<any>;
  contentType: ContentType;
}

export const ContentTypeFields = ({ form, contentType }: ContentTypeFieldsProps) => {
  if (contentType === 'article') {
    return <ArticleFields form={form} />;
  } 
  
  if (contentType === 'video') {
    return <VideoFields form={form} />;
  }

  if (contentType === 'guide') {
    return <GuideFields form={form} />;
  }

  // Resource type
  return <ResourceFields form={form} />;
};
