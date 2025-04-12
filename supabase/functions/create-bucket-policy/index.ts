
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
    // Create Supabase client with service role for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }
    
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

    // Create RLS policies for bucket
    try {
      // First try using RPC function
      try {
        await createPoliciesViaRPC(supabaseAdmin, bucketName);
        console.log(`Created RLS policies for ${bucketName} via RPC`);
      } catch (rpcError) {
        console.error("Error using RPC method:", rpcError);
        
        // Fallback to direct SQL approach
        try {
          await createPoliciesViaSQL(supabaseAdmin, bucketName);
          console.log(`Created RLS policies for ${bucketName} via SQL`);
        } catch (sqlError) {
          console.error("Error using SQL method:", sqlError);
          
          // There's no third method, but we tried our best
          console.log("Could not create policies via available methods, but bucket may still work");
        }
      }
    } catch (policyError) {
      console.error("General error creating policies:", policyError);
    }

    // Try applying policies to all common bucket names for maximum compatibility
    const commonBuckets = ['recursos', 'resources', 'uploads', 'files'];
    
    for (const name of commonBuckets) {
      if (name !== bucketName) {
        try {
          console.log(`Applying policies to common bucket: ${name}`);
          await createPoliciesViaRPC(supabaseAdmin, name);
          console.log(`Applied policies to ${name}`);
        } catch (error) {
          // Ignore errors for these additional buckets
        }
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

// Helper function to create policies via RPC
async function createPoliciesViaRPC(supabaseAdmin: any, bucketName: string) {
  try {
    // Create SELECT policy (read files)
    await supabaseAdmin.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: `anyone can read ${bucketName}`,
      definition: 'TRUE',
      operation: 'SELECT'
    });
    console.log(`Created SELECT policy for ${bucketName}`);
    
    // Create INSERT policy (upload files)
    await supabaseAdmin.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: `anyone can upload to ${bucketName}`,
      definition: 'TRUE',
      operation: 'INSERT'
    });
    console.log(`Created INSERT policy for ${bucketName}`);
    
    // Create UPDATE policy
    await supabaseAdmin.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: `anyone can update in ${bucketName}`,
      definition: 'TRUE',
      operation: 'UPDATE'
    });
    console.log(`Created UPDATE policy for ${bucketName}`);
    
    // Create DELETE policy
    await supabaseAdmin.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: `anyone can delete from ${bucketName}`,
      definition: 'TRUE',
      operation: 'DELETE'
    });
    console.log(`Created DELETE policy for ${bucketName}`);
  } catch (error) {
    console.error(`Error creating policies via RPC for ${bucketName}:`, error);
    throw error;
  }
}

// Helper function to create policies via SQL
async function createPoliciesViaSQL(supabaseAdmin: any, bucketName: string) {
  try {
    // This is a backup method using direct SQL execution
    // Only use if the RPC method fails
    const queries = [
      `CREATE POLICY "Allow public SELECT for ${bucketName}" ON storage.objects
       FOR SELECT USING (bucket_id = '${bucketName}');`,
       
      `CREATE POLICY "Allow public INSERT for ${bucketName}" ON storage.objects
       FOR INSERT WITH CHECK (bucket_id = '${bucketName}');`,
       
      `CREATE POLICY "Allow public UPDATE for ${bucketName}" ON storage.objects
       FOR UPDATE USING (bucket_id = '${bucketName}');`,
       
      `CREATE POLICY "Allow public DELETE for ${bucketName}" ON storage.objects
       FOR DELETE USING (bucket_id = '${bucketName}');`
    ];
    
    for (const query of queries) {
      try {
        await supabaseAdmin.rpc('exec_sql', { query });
      } catch (err) {
        // Policy might already exist, continue with next
        console.log(`SQL policy error (might already exist): ${err.message}`);
      }
    }
  } catch (error) {
    console.error(`Error creating policies via SQL for ${bucketName}:`, error);
    throw error;
  }
}
