
/**
 * Sleep utility for delay between retries
 * @param ms Milliseconds to sleep
 */
export const sleep = async (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Calculate exponential backoff delay for retries
 * @param attempt Current attempt number (0-based)
 * @param baseDelay Base delay in milliseconds
 * @returns Delay in milliseconds
 */
export const calculateBackoffDelay = (attempt: number, baseDelay = 1000): number => {
  return Math.pow(2, attempt) * baseDelay;
};

/**
 * Generate a bucket-safe file path with appropriate structure
 * @param originalPath Original file path or name
 * @returns Structured path for storage
 */
export const formatStoragePath = (originalPath: string): string => {
  // Add timestamp prefix to avoid conflicts
  const timestamp = Date.now();
  return `${timestamp}-${originalPath.replace(/\s+/g, '_')}`;
};

/**
 * Extract file extension from file path
 * @param filePath File path or name
 * @returns File extension (e.g., 'jpg', 'pdf')
 */
export const getFileExtension = (filePath: string): string => {
  return filePath.split('.').pop()?.toLowerCase() || '';
};

/**
 * Check if file type should be treated as an image
 * @param fileType MIME type or file extension
 * @returns True if image type
 */
export const isImageType = (fileType: string): boolean => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'jpg', 'jpeg', 'png', 'gif', 'webp'];
  return imageTypes.some(type => fileType.includes(type));
};
