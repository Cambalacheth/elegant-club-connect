
import { supabase } from "@/integrations/supabase/client";

/**
 * Service class for handling storage bucket operations
 */
export class BucketService {
  private readonly defaultBuckets = ['recursos', 'resources', 'uploads', 'files', 'images', 'avatars'];
  private lastSuccessfulBucket: string | null = null;

  /**
   * Create a new storage bucket
   * @param bucketName Name of the bucket to create
   * @returns Name of the created bucket or null if creation failed
   */
  public async createBucket(bucketName: string): Promise<string | null> {
    try {
      console.log(`Attempting to create bucket: ${bucketName}`);
      
      // Create policies first - this is important for permitting bucket creation
      await this.createBucketPolicies(bucketName);
      
      const { data, error } = await supabase.storage
        .createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
      
      if (!error) {
        console.log(`Bucket "${bucketName}" created successfully`);
        this.lastSuccessfulBucket = bucketName;
        return bucketName;
      } else {
        if (error.message?.includes("row-level security policy") || 
            error.message?.includes("403")) {
          console.log("Permission error, attempting to create policies first...");
          await this.createBucketPolicies(bucketName);
          
          // Even if we couldn't create the bucket, return the name as it might 
          // already exist and we have the policies in place now
          this.lastSuccessfulBucket = bucketName;
          return bucketName;
        }
        
        console.error(`Error creating bucket "${bucketName}":`, error);
        return null;
      }
    } catch (err) {
      console.error(`Exception creating bucket "${bucketName}":`, err);
      return null;
    }
  }

  /**
   * Update a bucket to make it public
   * @param bucketName Bucket to update
   */
  public async updateBucketToPublic(bucketName: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .updateBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
      
      if (error) {
        console.error(`Error updating bucket ${bucketName} to public:`, error);
      } else {
        console.log(`Bucket ${bucketName} updated to public`);
      }
    } catch (error) {
      console.error(`Error updating bucket ${bucketName}:`, error);
    }
  }

  /**
   * Check existing buckets and find ones that match our defaults
   * @returns Array of existing bucket names
   */
  public async getExistingBuckets(): Promise<string[]> {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error("Error listing buckets:", error);
        return [];
      }
      
      // Return all buckets, prioritizing our default ones
      const existingBuckets = buckets?.map(bucket => bucket.name) || [];
      
      // Sort to prioritize our default buckets first
      existingBuckets.sort((a, b) => {
        const aIsDefault = this.defaultBuckets.includes(a);
        const bIsDefault = this.defaultBuckets.includes(b);
        
        if (aIsDefault && !bIsDefault) return -1;
        if (!aIsDefault && bIsDefault) return 1;
        return 0;
      });
        
      console.log("Found existing buckets:", existingBuckets.join(', '));
      
      return existingBuckets;
    } catch (error) {
      console.error("Error getting existing buckets:", error);
      return [];
    }
  }

  /**
   * Create bucket policies for public access
   * @param bucketName Name of the bucket to create policies for
   */
  public async createBucketPolicies(bucketName: string): Promise<void> {
    try {
      console.log(`Creating policies for bucket "${bucketName}"...`);
      
      const response = await supabase.functions.invoke('create-bucket-policy', {
        body: { bucketName }
      });

      if (response.error) {
        throw new Error(`Edge function error: ${response.error.message}`);
      }
      
      console.log("Bucket policy created successfully:", response.data);
    } catch (error) {
      console.error("Error creating bucket policies:", error);
      throw error;
    }
  }

  /**
   * Create policies for all default buckets as a fallback
   */
  public async createPoliciesForAllBuckets(): Promise<void> {
    for (const bucketName of this.defaultBuckets) {
      try {
        await this.createBucketPolicies(bucketName);
      } catch (error) {
        console.error(`Error creating policies for ${bucketName}:`, error);
      }
    }
  }

  /**
   * Get the default buckets list
   */
  public getDefaultBuckets(): string[] {
    return [...this.defaultBuckets];
  }
  
  /**
   * Get the last successfully created or used bucket
   */
  public getLastSuccessfulBucket(): string | null {
    return this.lastSuccessfulBucket;
  }
  
  /**
   * Set the last successful bucket
   */
  public setLastSuccessfulBucket(bucketName: string): void {
    this.lastSuccessfulBucket = bucketName;
  }
}

// Create singleton instance
export const bucketService = new BucketService();
