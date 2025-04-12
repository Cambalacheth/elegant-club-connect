
/**
 * Utility functions for handling file uploads
 */

// Exponential backoff delay for retries
export const getBackoffDelay = (attempt: number): number => {
  return Math.pow(2, attempt) * 1000; // Exponential backoff
};

// Sleep function for delay between retries
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Attempts to upload a file with retry logic
export const uploadWithRetry = async (
  uploadFn: (file: File, fileName: string) => Promise<string>,
  file: File, 
  fileName: string, 
  maxAttempts: number = 3
): Promise<string> => {
  let attemptCount = 0;
  let lastError: any = null;
  
  while (attemptCount < maxAttempts) {
    try {
      return await uploadFn(file, fileName);
    } catch (error: any) {
      lastError = error;
      console.error(`Upload attempt ${attemptCount + 1} failed:`, error);
      
      // If we reach the max attempts, throw the error
      if (attemptCount + 1 >= maxAttempts) {
        break;
      }
      
      // If we get permission errors, wait longer between retries
      if (error.message && (
          error.message.includes('permission') || 
          error.message.includes('security policy') || 
          error.message.includes('403')
      )) {
        const delay = getBackoffDelay(attemptCount);
        console.log(`Error in permission. Retrying in ${delay/1000} seconds...`);
        await sleep(delay);
      }
      
      attemptCount++;
    }
  }
  
  throw lastError || new Error("No se pudo subir el archivo después de varios intentos");
};
