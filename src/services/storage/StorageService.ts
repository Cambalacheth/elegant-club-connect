
import { supabase } from "@/integrations/supabase/client";
import { bucketService } from "./BucketService";
import { uploadService } from "./UploadService";
import { formatStoragePath } from "./StorageUtils";

/**
 * StorageService class for handling storage operations
 * Main facade for storage functionality
 */
export class StorageService {
  /**
   * Initialize storage buckets ensuring at least one bucket is available
   * @returns The name of the primary bucket that was successfully initialized
   */
  public async initializeBuckets(): Promise<string> {
    try {
      console.log("Initializing storage buckets...");
      
      // Check existing buckets
      const existingBuckets = await bucketService.getExistingBuckets();
      
      // If we have existing buckets, use the first one
      if (existingBuckets.length > 0) {
        const currentBucket = existingBuckets[0];
        uploadService.setCurrentBucket(currentBucket);
        
        console.log(`Using existing bucket: ${currentBucket}`);
        
        // Ensure the bucket has proper public access
        await bucketService.updateBucketToPublic(currentBucket);
        
        // Create policies for existing bucket
        await bucketService.createBucketPolicies(currentBucket);
        
        return currentBucket;
      }
      
      // Try to create a new bucket if none exists
      return await this.createNewBucket();
    } catch (error) {
      console.error("Error initializing storage buckets:", error);
      
      // Fail to a default value if everything else fails
      const defaultBucket = bucketService.getDefaultBuckets()[0];
      uploadService.setCurrentBucket(defaultBucket);
      console.warn(`Setting default bucket to ${defaultBucket} after error`);
      
      // Ensure policies are created even if we fail
      await this.createBucketPoliciesForAll();
      
      return defaultBucket;
    }
  }
  
  /**
   * Upload a file to the storage bucket
   * @param file File to upload
   * @param fileName Name to save the file as
   * @returns Public URL of the uploaded file
   */
  public async uploadFile(file: File, fileName: string): Promise<string> {
    try {
      // Ensure buckets are initialized
      if (!uploadService.getCurrentBucket()) {
        await this.initializeBuckets();
      }
      
      // Format storage path to avoid conflicts
      const storagePath = formatStoragePath(fileName);
      
      // Create policies before attempting upload
      await this.createBucketPoliciesForAll();
      
      // Retry logic is handled by the upload service
      return await uploadService.uploadFileWithRetry(file, storagePath);
    } catch (error) {
      console.error("Error in uploadFile:", error);
      throw error;
    }
  }
  
  /**
   * Create storage bucket policies for public access on all default buckets
   */
  public async createBucketPoliciesForAll(): Promise<void> {
    await bucketService.createPoliciesForAllBuckets();
  }
  
  /**
   * Create new storage bucket
   * @returns Name of the created bucket
   */
  private async createNewBucket(): Promise<string> {
    console.log("No existing buckets found. Creating new bucket...");
    const defaultBuckets = bucketService.getDefaultBuckets();
    
    // Try each bucket name in order
    for (const bucketName of defaultBuckets) {
      const result = await bucketService.createBucket(bucketName);
      if (result) {
        uploadService.setCurrentBucket(result);
        return result;
      }
    }
    
    // If we can't create any bucket, use the first name as fallback
    console.warn("Could not create any bucket. Using fallback.");
    const fallbackBucket = defaultBuckets[0];
    uploadService.setCurrentBucket(fallbackBucket);
    
    // Create policies for fallback bucket
    await bucketService.createBucketPolicies(fallbackBucket);
    
    return fallbackBucket;
  }
  
  /**
   * Create bucket policies for a specific bucket
   * @param bucketName Name of the bucket to create policies for
   */
  public async createBucketPolicies(bucketName: string): Promise<void> {
    await bucketService.createBucketPolicies(bucketName);
  }
  
  /**
   * Get public URL for a file
   * @param filePath Path to the file
   * @returns Public URL
   */
  public getPublicUrl(filePath: string): string {
    return uploadService.getPublicUrl(filePath);
  }
}

// Create singleton instance
export const storageService = new StorageService();
