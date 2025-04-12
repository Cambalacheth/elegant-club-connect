/**
 * Utility functions for file operations
 */

// Check if a file type is valid based on allowed mime types
export const isValidFileType = (fileType: string): boolean => {
  const validFileTypes = [
    // Documents
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/msword', // doc
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.ms-excel', // xls
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
    'application/vnd.ms-powerpoint', // ppt
    'application/rtf', // rtf
    'text/plain', // txt
    'text/csv', // csv
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp',
    'image/tiff',
    'image/bmp',
    // Other
    'application/zip',
    'application/x-zip-compressed',
    'application/vnd.rar',
    'application/x-7z-compressed'
  ];
  
  return validFileTypes.includes(fileType);
};

// Check if file size is within limits (in bytes)
export const isValidFileSize = (size: number, maxSize: number = 10 * 1024 * 1024): boolean => {
  return size <= maxSize;
};

// Create a safe filename from an original filename
export const createSafeFilename = (originalName: string): string => {
  const fileExt = originalName.split('.').pop() || '';
  const baseName = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, '_');
  return `${Date.now()}-${baseName}.${fileExt}`;
};

// Determine resource type based on file extension
export const determineResourceType = (fileExt: string): string | null => {
  fileExt = fileExt.toLowerCase();
  
  if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(fileExt)) {
    return 'document';
  } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'tiff', 'bmp'].includes(fileExt)) {
    return 'infographic';
  } else if (['ppt', 'pptx'].includes(fileExt)) {
    return 'presentation';
  } else if (['xls', 'xlsx', 'csv'].includes(fileExt)) {
    return 'spreadsheet';
  } else if (['zip', 'rar', '7z'].includes(fileExt)) {
    return 'tool';
  }
  
  return null;
};
