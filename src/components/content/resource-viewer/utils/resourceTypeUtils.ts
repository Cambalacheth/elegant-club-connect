
/**
 * Helper functions to determine resource types based on file extensions and URLs
 */

export function getResourceTypeFromExtension(extension?: string): string {
  if (!extension) return 'unknown';
  
  switch (extension) {
    case 'pdf':
      return 'document';
    case 'doc':
    case 'docx':
      return 'document';
    case 'xls':
    case 'xlsx':
      return 'spreadsheet';
    case 'ppt':
    case 'pptx':
      return 'presentation';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'webp':
      return 'infographic';
    default:
      return 'unknown';
  }
}

export function isImageResource(type?: string, extension?: string): boolean {
  if (type === 'infographic') return true;
  return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '');
}

export function isPresentationResource(type?: string, extension?: string): boolean {
  if (type === 'presentation') return true;
  return ['ppt', 'pptx'].includes(extension || '') || 
         (type === 'presentation') ||
         isGoogleSlidesUrl(type || '');
}

export function isPDFResource(type?: string, extension?: string): boolean {
  if (type === 'document' && extension === 'pdf') return true;
  return extension === 'pdf';
}

export function isExternalStorageLink(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  return lowerUrl.includes('drive.google.com') || 
         lowerUrl.includes('docs.google.com') || 
         lowerUrl.includes('onedrive.live.com') ||
         lowerUrl.includes('dropbox.com');
}

export function isGoogleSlidesUrl(url: string): boolean {
  return url.includes('docs.google.com/presentation');
}

export function getEmbedUrl(url: string): string | null {
  // Google Drive file link to preview embed
  if (url.includes('drive.google.com/file/d/')) {
    const fileIdMatch = url.match(/\/d\/([^\/]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  }
  
  // Google Drive folder to embed
  if (url.includes('drive.google.com/drive/folders/')) {
    const folderIdMatch = url.match(/\/folders\/([^\/]+)/);
    if (folderIdMatch && folderIdMatch[1]) {
      return `https://drive.google.com/embeddedfolderview?id=${folderIdMatch[1]}#list`;
    }
  }
  
  // Google Slides
  if (url.includes('docs.google.com/presentation')) {
    return url.replace(/\/edit.*$/, '/embed');
  }
  
  // For other services, you might need to implement similar conversions
  return null;
}
