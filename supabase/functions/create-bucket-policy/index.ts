
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
    const supabase = createClient(
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

    // First, ensure the bucket exists
    try {
      const { data: bucketExists, error: checkError } = await supabase.storage.getBucket(bucketName);
      
      if (checkError && !bucketExists) {
        // Create the bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });

        if (createError) {
          console.error("Error creating bucket:", createError);
          return new Response(
            JSON.stringify({ error: createError.message }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }
      }
    } catch (bucketError) {
      console.error("Bucket check/creation error:", bucketError);
    }

    // Now create the public policies for the bucket
    try {
      // Allow any authenticated user to upload files
      const { error: uploadPolicyError } = await supabase.rpc('create_storage_policy', {
        bucket_name: bucketName,
        policy_name: 'authenticated users can upload',
        definition: `auth.role() = 'authenticated'`,
        policy_action: 'INSERT'
      });

      if (uploadPolicyError) {
        console.error("Error creating upload policy:", uploadPolicyError);
      }

      // Allow all users to read files
      const { error: readPolicyError } = await supabase.rpc('create_storage_policy', {
        bucket_name: bucketName,
        policy_name: 'anyone can read',
        definition: `true`,
        policy_action: 'SELECT'
      });

      if (readPolicyError) {
        console.error("Error creating read policy:", readPolicyError);
      }

      // Allow content creators to update their files
      const { error: updatePolicyError } = await supabase.rpc('create_storage_policy', {
        bucket_name: bucketName,
        policy_name: 'authenticated users can update',
        definition: `auth.role() = 'authenticated'`,
        policy_action: 'UPDATE'
      });

      if (updatePolicyError) {
        console.error("Error creating update policy:", updatePolicyError);
      }

      // Allow content creators to delete their files
      const { error: deletePolicyError } = await supabase.rpc('create_storage_policy', {
        bucket_name: bucketName,
        policy_name: 'authenticated users can delete',
        definition: `auth.role() = 'authenticated'`,
        policy_action: 'DELETE'
      });

      if (deletePolicyError) {
        console.error("Error creating delete policy:", deletePolicyError);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Public policies created for bucket: ${bucketName}`,
          policies: {
            insert: !uploadPolicyError,
            select: !readPolicyError,
            update: !updatePolicyError,
            delete: !deletePolicyError
          }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (error) {
      console.error("Error creating policies:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create policies" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
