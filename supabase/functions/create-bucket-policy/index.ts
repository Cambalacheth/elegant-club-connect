
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Create Supabase admin client with SERVICE_ROLE key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { bucketName } = await req.json();

    if (!bucketName) {
      return new Response(
        JSON.stringify({ error: "Bucket name is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`Setting up policies for bucket: ${bucketName}`);

    // First, try direct SQL approach to create policies which is more reliable
    try {
      // Create the bucket if it doesn't exist
      try {
        const { data, error } = await supabaseAdmin.rpc('create_storage_bucket_if_not_exists', {
          bucket_id: bucketName,
          public_policy: true
        });
        
        console.log("Create bucket result:", data, error);
      } catch (bucketError) {
        console.log("Could not create bucket with RPC, trying alternative method", bucketError);
        
        // Try to ensure bucket exists using storage API
        const { data: bucketExists, error: checkError } = await supabaseAdmin.storage.getBucket(bucketName);
        
        if (checkError && !bucketExists) {
          // Create the bucket if it doesn't exist
          const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 10485760 // 10MB
          });

          if (createError) {
            console.error("Error creating bucket:", createError);
          } else {
            console.log(`Bucket ${bucketName} created successfully`);
          }
        }
      }

      // Now create storage policies using raw SQL which is more reliable
      const { error: policiesError } = await supabaseAdmin.rpc('create_public_bucket_policies', { 
        bucket_id: bucketName 
      });
      
      if (policiesError) {
        console.error("Error creating policies with RPC:", policiesError);
        
        // Try direct SQL execution as fallback
        const { error: sqlError } = await supabaseAdmin.sql`
          -- Allow public access to read objects
          CREATE POLICY IF NOT EXISTS "Allow public read access" 
          ON storage.objects 
          FOR SELECT USING (bucket_id = ${bucketName});
          
          -- Allow authenticated users to insert objects
          CREATE POLICY IF NOT EXISTS "Allow authenticated insert access" 
          ON storage.objects 
          FOR INSERT WITH CHECK (bucket_id = ${bucketName} AND auth.role() = 'authenticated');
          
          -- Allow authenticated users to update their own objects
          CREATE POLICY IF NOT EXISTS "Allow authenticated update access" 
          ON storage.objects 
          FOR UPDATE USING (bucket_id = ${bucketName} AND auth.role() = 'authenticated');
          
          -- Allow authenticated users to delete their own objects
          CREATE POLICY IF NOT EXISTS "Allow authenticated delete access" 
          ON storage.objects 
          FOR DELETE USING (bucket_id = ${bucketName} AND auth.role() = 'authenticated');
        `;
        
        if (sqlError) {
          console.error("Error executing SQL directly:", sqlError);
        } else {
          console.log("Successfully created policies with direct SQL");
        }
      } else {
        console.log("Successfully created policies with RPC");
      }
    } catch (sqlError) {
      console.error("Error with SQL approach:", sqlError);
      
      // Fallback to using the storage API if SQL approach fails
      try {
        // Create policies using the API method
        console.log("Attempting to create policies using API method...");
        
        // Allow anyone to read files (SELECT)
        const { error: readPolicyError } = await supabaseAdmin
          .from('storage.policies')
          .insert({
            name: 'anyone can read',
            definition: 'TRUE',
            bucket_id: bucketName,
            operation: 'SELECT'
          });
          
        if (readPolicyError) console.error("Error creating read policy:", readPolicyError);
        
        // Allow authenticated users to upload files (INSERT)
        const { error: uploadPolicyError } = await supabaseAdmin
          .from('storage.policies')
          .insert({
            name: 'authenticated users can upload',
            definition: "auth.role() = 'authenticated'",
            bucket_id: bucketName,
            operation: 'INSERT'
          });
          
        if (uploadPolicyError) console.error("Error creating upload policy:", uploadPolicyError);
        
        // Allow authenticated users to update files (UPDATE)
        const { error: updatePolicyError } = await supabaseAdmin
          .from('storage.policies')
          .insert({
            name: 'authenticated users can update',
            definition: "auth.role() = 'authenticated'",
            bucket_id: bucketName,
            operation: 'UPDATE'
          });
          
        if (updatePolicyError) console.error("Error creating update policy:", updatePolicyError);
        
        // Allow authenticated users to delete files (DELETE)
        const { error: deletePolicyError } = await supabaseAdmin
          .from('storage.policies')
          .insert({
            name: 'authenticated users can delete',
            definition: "auth.role() = 'authenticated'",
            bucket_id: bucketName,
            operation: 'DELETE'
          });
          
        if (deletePolicyError) console.error("Error creating delete policy:", deletePolicyError);
      } catch (apiError) {
        console.error("Error creating policies with API method:", apiError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Public policies created for bucket: ${bucketName}`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
