
import { ContentItem } from "@/types/content";

/**
 * Filters content items by ID to remove a specific item
 */
export const filterContentById = (content: ContentItem[], idToRemove: string): ContentItem[] => {
  return content.filter(item => item.id !== idToRemove);
};
