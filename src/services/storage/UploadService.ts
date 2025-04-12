
import { supabase } from "@/integrations/supabase/client";
import { bucketService } from "./BucketService";
import { sleep, calculateBackoffDelay } from "./StorageUtils";

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
    maxAttempts = 5
  ): Promise<string> {
    // 0. First check if we already have existing buckets to use
    if (!this.currentBucket) {
      const existingBuckets = await bucketService.getExistingBuckets();
      
      if (existingBuckets.length > 0) {
        this.currentBucket = existingBuckets[0];
        console.log(`Using existing bucket: ${this.currentBucket}`);
      } else {
        this.currentBucket = bucketService.getDefaultBuckets()[0];
        console.log(`No existing buckets found, using default: ${this.currentBucket}`);
      }
    }
    
    // Options for file upload
    const defaultBuckets = bucketService.getDefaultBuckets();
    let lastError: Error | null = null;
    
    // 1. Try with current bucket with retries
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        console.log(`Uploading to ${this.currentBucket}, attempt ${attempt + 1}...`);
        
        // Ensure we have bucket policies before uploading
        await bucketService.createBucketPolicies(this.currentBucket!);
        
        const publicUrl = await this.uploadFileToBucket(file, fileName, this.currentBucket!);
        if (publicUrl) {
          return publicUrl;
        }
        
        // Wait before retrying
        if (attempt < maxAttempts - 1) {
          const delay = calculateBackoffDelay(attempt);
          console.log(`Retrying upload in ${delay}ms...`);
          await sleep(delay);
        }
      } catch (error: any) {
        console.error(`Upload attempt ${attempt + 1} failed:`, error);
        lastError = error;
        
        if (attempt < maxAttempts - 1) {
          const delay = calculateBackoffDelay(attempt);
          console.log(`Retrying in ${delay}ms...`);
          await sleep(delay);
        }
      }
    }
    
    // 2. If primary bucket fails, try all existing buckets first
    const existingBuckets = await bucketService.getExistingBuckets();
    
    for (const bucketName of existingBuckets.filter(b => b !== this.currentBucket)) {
      try {
        console.log(`Trying existing bucket "${bucketName}"...`);
        
        // Create policies for the bucket
        await bucketService.createBucketPolicies(bucketName);
        
        const publicUrl = await this.uploadFileToBucket(file, fileName, bucketName);
        if (publicUrl) {
          this.currentBucket = bucketName;
          return publicUrl;
        }
      } catch (fallbackError) {
        console.error(`Error with existing bucket "${bucketName}":`, fallbackError);
      }
    }
    
    // 3. If existing buckets fail, try fallback buckets
    for (const bucketName of defaultBuckets.filter(b => !existingBuckets.includes(b) && b !== this.currentBucket)) {
      try {
        console.log(`Trying fallback bucket "${bucketName}"...`);
        
        // Create bucket and policies
        await bucketService.createBucket(bucketName);
        
        const publicUrl = await this.uploadFileToBucket(file, fileName, bucketName);
        if (publicUrl) {
          this.currentBucket = bucketName;
          return publicUrl;
        }
      } catch (fallbackError) {
        console.error(`Error with fallback bucket "${bucketName}":`, fallbackError);
      }
    }
    
    // 4. If user had a successful upload before, try that bucket specifically
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
