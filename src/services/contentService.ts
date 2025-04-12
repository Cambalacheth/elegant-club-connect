
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
      
      // Video fields
      video_url: newContent.videoUrl,
      duration: newContent.duration,
      
      // Resource fields
      resource_url: newContent.resourceUrl,
      resource_type: newContent.resourceType,
      price: newContent.price,
      
      // Guide fields
      difficulty: newContent.difficulty,
      download_url: newContent.downloadUrl,
      
      // Common fields
      category: newContent.category,
      published: newContent.published || false,
      source: newContent.source,
      external_url: newContent.externalUrl
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
      
      // Video fields
      video_url: updates.videoUrl,
      duration: updates.duration,
      
      // Resource fields
      resource_url: updates.resourceUrl,
      resource_type: updates.resourceType,
      price: updates.price,
      
      // Guide fields
      difficulty: updates.difficulty,
      download_url: updates.downloadUrl,
      
      // Common fields
      category: updates.category,
      published: updates.published,
      source: updates.source,
      external_url: updates.externalUrl,
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
 * Extracts YouTube video ID from a YouTube URL
 */
export const extractYoutubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Match patterns like:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://youtube.com/shorts/VIDEO_ID
  const regex = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  
  return match ? match[1] : null;
};

/**
 * Get YouTube thumbnail URL from video ID
 */
export const getYoutubeThumbnailUrl = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

/**
 * Maps data from the database to ContentItem objects
 */
const mapContentData = (data: any[]): ContentItem[] => {
  return data.map(item => {
    // Extract YouTube video ID if there's a video URL
    let imageUrl = item.image_url || "";
    const videoId = item.video_url ? extractYoutubeVideoId(item.video_url) : null;
    
    // If this is a video and no image was provided, use YouTube thumbnail
    if (item.type === 'video' && videoId && !imageUrl) {
      imageUrl = getYoutubeThumbnailUrl(videoId);
    }
    
    return {
      id: item.id,
      title: item.title,
      description: item.description || "",
      content: item.content || undefined,
      imageUrl: imageUrl,
      type: item.type as ContentType,
      author_id: item.author_id,
      author_username: item.author?.username || "Usuario",
      author_role: item.author?.level,
      
      // Video fields
      videoUrl: item.video_url || undefined,
      videoId: videoId, // Add the extracted videoId
      duration: item.duration || undefined,
      
      // Resource fields
      resourceUrl: item.resource_url || undefined,
      resourceType: item.resource_type || undefined,
      price: item.price || undefined,
      
      // Guide fields
      difficulty: item.difficulty || undefined,
      downloadUrl: item.download_url || undefined,
      
      // Common fields
      source: item.source || undefined,
      externalUrl: item.external_url || undefined,
      created_at: item.created_at,
      updated_at: item.updated_at,
      category: item.category,
      published: item.published
    };
  });
};
