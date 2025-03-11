
import { supabase } from "@/integrations/supabase/client";
import { ContentItem, ContentType } from "@/types/content";

/**
 * Fetches published content from the database
 */
export const fetchPublishedContent = async (type?: ContentType) => {
  let query = supabase
    .from("content")
    .select("*, author:profiles(username, level)")
    .eq('published', true);

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return mapContentData(data);
};

/**
 * Fetches all content (including unpublished) from the database (admin-only)
 */
export const fetchAllContentData = async (type?: ContentType) => {
  let query = supabase
    .from("content")
    .select("*, author:profiles(username, level)");

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return mapContentData(data);
};

/**
 * Creates a new content item in the database
 */
export const createContentItem = async (newContent: Partial<ContentItem>) => {
  const { data, error } = await supabase.from("content").insert([
    {
      title: newContent.title,
      description: newContent.description,
      content: newContent.content,
      image_url: newContent.imageUrl,
      type: newContent.type,
      author_id: newContent.author_id,
      video_url: newContent.videoUrl,
      resource_url: newContent.resourceUrl,
      category: newContent.category,
      published: newContent.published || false
    }
  ]).select();

  if (error) {
    throw error;
  }

  return data[0];
};

/**
 * Updates an existing content item in the database
 */
export const updateContentItem = async (id: string, updates: Partial<ContentItem>) => {
  const { data, error } = await supabase
    .from("content")
    .update({
      title: updates.title,
      description: updates.description,
      content: updates.content,
      image_url: updates.imageUrl,
      video_url: updates.videoUrl,
      resource_url: updates.resourceUrl,
      category: updates.category,
      published: updates.published,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();

  if (error) {
    throw error;
  }

  return data[0];
};

/**
 * Deletes a content item from the database
 */
export const deleteContentItem = async (id: string) => {
  const { error } = await supabase
    .from("content")
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return true;
};

/**
 * Maps data from the database to ContentItem objects
 */
const mapContentData = (data: any[]): ContentItem[] => {
  return data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || "",
    content: item.content || undefined,
    imageUrl: item.image_url || "",
    type: item.type as ContentType,
    author_id: item.author_id,
    author_username: item.author?.username || "Usuario",
    author_role: item.author?.level,
    videoUrl: item.video_url || undefined,
    resourceUrl: item.resource_url || undefined,
    created_at: item.created_at,
    updated_at: item.updated_at,
    category: item.category,
    published: item.published
  }));
};
