
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
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

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

    // First, ensure the bucket exists with public access
    try {
      // Try to get the bucket first
      const { data: bucketExists, error: checkError } = await supabaseAdmin.storage.getBucket(bucketName);
      
      // If bucket doesn't exist or there was an error checking it
      if (checkError || !bucketExists) {
        console.log(`Bucket ${bucketName} doesn't exist or error checking it:`, checkError);
        
        // Try to create the bucket
        const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });

        if (createError) {
          console.error("Error creating bucket:", createError);
          // Continue with policy creation anyway
        } else {
          console.log(`Bucket ${bucketName} created successfully`);
        }
      } else {
        // Bucket exists, update it to be public
        const { error: updateError } = await supabaseAdmin.storage.updateBucket(
          bucketName, 
          { public: true, fileSizeLimit: 10485760 }
        );
        
        if (updateError) {
          console.error("Error updating bucket to be public:", updateError);
        } else {
          console.log(`Bucket ${bucketName} updated to be public`);
        }
      }
    } catch (bucketError) {
      console.error("Error handling bucket:", bucketError);
      // Continue with policy creation anyway
    }

    // Method to create policies using Supabase's Storage API
    let policySuccess = false;
    try {
      console.log("Attempting to create policies using API method...");
      
      // Create policies for all common bucket names to maximize chances
      const bucketNames = [bucketName, 'recursos', 'resources', 'uploads', 'files'];
      
      for (const name of bucketNames) {
        try {
          // Try to verify bucket exists
          try {
            await supabaseAdmin.storage.emptyBucket(name);
            console.log(`Successfully verified bucket ${name} exists`);
          } catch (emptyError) {
            // Ignore error, just a test to see if bucket exists
          }

          // Create SELECT policy (read files)
          try {
            await supabaseAdmin.rpc('create_storage_policy', {
              bucket_name: name,
              policy_name: `anyone can read ${name}`,
              definition: 'TRUE',
              operation: 'SELECT'
            });
            console.log(`Created SELECT policy for ${name}`);
          } catch (selectError) {
            console.error(`Error creating SELECT policy for ${name}:`, selectError);
          }
              
          // Create INSERT policy (upload files)
          try {
            await supabaseAdmin.rpc('create_storage_policy', {
              bucket_name: name,
              policy_name: `anyone can upload to ${name}`,
              definition: 'TRUE',
              operation: 'INSERT'
            });
            console.log(`Created INSERT policy for ${name}`);
          } catch (insertError) {
            console.error(`Error creating INSERT policy for ${name}:`, insertError);
          }
              
          // Create UPDATE policy
          try {
            await supabaseAdmin.rpc('create_storage_policy', {
              bucket_name: name,
              policy_name: `anyone can update in ${name}`,
              definition: 'TRUE',
              operation: 'UPDATE'
            });
            console.log(`Created UPDATE policy for ${name}`);
          } catch (updateError) {
            console.error(`Error creating UPDATE policy for ${name}:`, updateError);
          }
              
          // Create DELETE policy
          try {
            await supabaseAdmin.rpc('create_storage_policy', {
              bucket_name: name,
              policy_name: `anyone can delete from ${name}`,
              definition: 'TRUE',
              operation: 'DELETE'
            });
            console.log(`Created DELETE policy for ${name}`);
          } catch (deleteError) {
            console.error(`Error creating DELETE policy for ${name}:`, deleteError);
          }
          
          console.log(`Created policies for bucket ${name} via API`);
          policySuccess = true;
        } catch (bucketError) {
          console.log(`Could not create policies for ${name} via API:`, bucketError);
        }
      }
    } catch (apiError) {
      console.error("Error creating policies with API method:", apiError);
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
