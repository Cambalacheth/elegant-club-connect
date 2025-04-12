
import { supabase } from "@/integrations/supabase/client";
import { bucketService } from "./BucketService";
import { sleep } from "./StorageUtils";

/**
 * Service class for handling file uploads
 */
export class UploadService {
  private currentBucket: string | null = null;

  /**
   * Upload a file to a specific bucket
   * @param file File to upload
   * @param fileName Name to save the file as
   * @param bucketName Target bucket for upload
   * @returns Public URL of the uploaded file or null if failed
   */
  public async uploadFileToBucket(
    file: File, 
    fileName: string, 
    bucketName: string
  ): Promise<string | null> {
    try {
      console.log(`Uploading to ${bucketName}...`);
      
      // Create policies for bucket before upload
      await bucketService.createBucketPolicies(bucketName);
      
      const options = {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      };
      
      const uploadResult = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, options);
      
      if (uploadResult.error) {
        console.error(`Upload to ${bucketName} failed:`, uploadResult.error);
        return null;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      
      // Remember successful bucket
      bucketService.setLastSuccessfulBucket(bucketName);
      this.currentBucket = bucketName;
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error(`Error uploading to ${bucketName}:`, error);
      return null;
    }
  }

  /**
   * Upload a file with retry mechanism and fallback buckets
   * @param file File to upload
   * @param fileName Name to save the file as
   * @param maxAttempts Maximum number of retry attempts
   * @returns Public URL of the uploaded file
   */
  public async uploadFileWithRetry(
    file: File, 
    fileName: string, 
    maxAttempts = 3
  ): Promise<string> {
    if (!this.currentBucket) {
      this.currentBucket = (await bucketService.getExistingBuckets())[0] || bucketService.getDefaultBuckets()[0];
    }
    
    // Options for file upload
    const defaultBuckets = bucketService.getDefaultBuckets();
    let lastError: Error | null = null;
    
    // 1. Try with primary bucket
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        console.log(`Uploading to ${this.currentBucket}, attempt ${attempt + 1}...`);
        
        // Ensure we have bucket policies before uploading
        await bucketService.createBucketPolicies(this.currentBucket!);
        
        const publicUrl = await this.uploadFileToBucket(file, fileName, this.currentBucket!);
        if (publicUrl) {
          return publicUrl;
        }
        
        // Permission errors are common during first uploads
        console.log("Permission error, recreating policies...");
        await bucketService.createBucketPolicies(this.currentBucket!);
        
        // Wait before retrying
        if (attempt < maxAttempts - 1) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await sleep(delay);
        }
      } catch (error: any) {
        console.error(`Upload attempt ${attempt + 1} failed:`, error);
        lastError = error;
        
        if (attempt < maxAttempts - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          await sleep(delay);
        }
      }
    }
    
    // 2. If primary bucket fails, try fallback buckets
    for (const fallbackBucket of defaultBuckets.filter(b => b !== this.currentBucket)) {
      try {
        console.log(`Trying fallback bucket "${fallbackBucket}"...`);
        
        // Create policies for fallback bucket
        await bucketService.createBucketPolicies(fallbackBucket);
        
        const publicUrl = await this.uploadFileToBucket(file, fileName, fallbackBucket);
        if (publicUrl) {
          this.currentBucket = fallbackBucket;
          return publicUrl;
        }
      } catch (fallbackError) {
        console.error(`Error with fallback bucket "${fallbackBucket}":`, fallbackError);
      }
    }
    
    // 3. If user had a successful upload before, try that bucket specifically
    const lastSuccessfulBucket = bucketService.getLastSuccessfulBucket();
    if (lastSuccessfulBucket && lastSuccessfulBucket !== this.currentBucket) {
      try {
        console.log(`Trying previously successful bucket "${lastSuccessfulBucket}"...`);
        
        const publicUrl = await this.uploadFileToBucket(file, fileName, lastSuccessfulBucket);
        if (publicUrl) {
          this.currentBucket = lastSuccessfulBucket;
          return publicUrl;
        }
      } catch (error) {
        console.error(`Error with last successful bucket "${lastSuccessfulBucket}":`, error);
      }
    }
    
    // If all attempts and all buckets fail, throw error
    throw lastError || new Error("Failed to upload file after trying all available buckets");
  }

  /**
   * Get public URL for a file
   * @param filePath Path to the file
   * @param bucketName Optional bucket name (uses current bucket if not specified)
   * @returns Public URL
   */
  public getPublicUrl(filePath: string, bucketName?: string): string {
    const bucket = bucketName || this.currentBucket;
    
    if (!bucket) {
      throw new Error("No bucket selected. Call initializeBuckets first.");
    }
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  }
  
  /**
   * Set the current bucket
   */
  public setCurrentBucket(bucketName: string): void {
    this.currentBucket = bucketName;
  }
  
  /**
   * Get the current bucket
   */
  public getCurrentBucket(): string | null {
    return this.currentBucket;
  }
}

// Create singleton instance
export const uploadService = new UploadService();
