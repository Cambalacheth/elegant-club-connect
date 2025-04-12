
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
    }

    // Now create storage policies using direct SQL which is more reliable
    // Try multiple methods to ensure at least one works
    let policySuccess = false;

    // Method 1: Use built-in RPC function if it exists
    try {
      const { error: policiesError } = await supabaseAdmin.rpc('create_public_bucket_policies', { 
        bucket_id: bucketName 
      });
      
      if (!policiesError) {
        console.log("Successfully created policies with RPC function");
        policySuccess = true;
      } else {
        console.error("Error creating policies with RPC:", policiesError);
      }
    } catch (rpcError) {
      console.error("RPC method failed or doesn't exist:", rpcError);
    }

    // Method 2: Direct SQL execution if Method 1 failed
    if (!policySuccess) {
      try {
        console.log("Trying direct SQL execution for policies...");
        
        // More permissive policies that allow all operations for anonymous users
        const { error: sqlError } = await supabaseAdmin.sql`
          -- Delete any existing policies first to avoid conflicts
          DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
          DROP POLICY IF EXISTS "Allow authenticated insert access" ON storage.objects;
          DROP POLICY IF EXISTS "Allow authenticated update access" ON storage.objects;
          DROP POLICY IF EXISTS "Allow authenticated delete access" ON storage.objects;
          DROP POLICY IF EXISTS "Allow everyone read access" ON storage.objects;
          DROP POLICY IF EXISTS "Allow everyone insert access" ON storage.objects;
          DROP POLICY IF EXISTS "Allow everyone update access" ON storage.objects;
          DROP POLICY IF EXISTS "Allow everyone delete access" ON storage.objects;
          
          -- Allow everyone to read objects (most permissive)
          CREATE POLICY "Allow everyone read access" 
          ON storage.objects 
          FOR SELECT 
          USING (bucket_id = ${bucketName} OR bucket_id IN ('recursos', 'resources', 'uploads', 'files'));
          
          -- Allow everyone to insert objects (most permissive)
          CREATE POLICY "Allow everyone insert access" 
          ON storage.objects 
          FOR INSERT 
          WITH CHECK (bucket_id = ${bucketName} OR bucket_id IN ('recursos', 'resources', 'uploads', 'files'));
          
          -- Allow everyone to update objects (most permissive)
          CREATE POLICY "Allow everyone update access" 
          ON storage.objects 
          FOR UPDATE 
          USING (bucket_id = ${bucketName} OR bucket_id IN ('recursos', 'resources', 'uploads', 'files'));
          
          -- Allow everyone to delete objects (most permissive)
          CREATE POLICY "Allow everyone delete access" 
          ON storage.objects 
          FOR DELETE 
          USING (bucket_id = ${bucketName} OR bucket_id IN ('recursos', 'resources', 'uploads', 'files'));
        `;
        
        if (!sqlError) {
          console.log("Successfully created policies with direct SQL");
          policySuccess = true;
        } else {
          console.error("Error executing SQL directly:", sqlError);
        }
      } catch (sqlError) {
        console.error("Error with direct SQL approach:", sqlError);
      }
    }

    // Method 3: Try using the storage policies API as a last resort
    if (!policySuccess) {
      try {
        console.log("Attempting to create policies using API method...");
        
        // Create policies for all common bucket names to maximize chances
        const bucketNames = [bucketName, 'recursos', 'resources', 'uploads', 'files'];
        let apiSuccess = false;
        
        for (const name of bucketNames) {
          try {
            // Allow anyone to read files (SELECT)
            await supabaseAdmin.storage.from(name).getPublicUrl('test'); // Test if bucket exists
            
            const readPolicy = await supabaseAdmin
              .from('storage.policies')
              .insert({
                name: `anyone can read ${name}`,
                definition: 'TRUE',
                bucket_id: name,
                operation: 'SELECT'
              });
              
            const uploadPolicy = await supabaseAdmin
              .from('storage.policies')
              .insert({
                name: `anyone can upload to ${name}`,
                definition: 'TRUE',
                bucket_id: name,
                operation: 'INSERT'
              });
              
            const updatePolicy = await supabaseAdmin
              .from('storage.policies')
              .insert({
                name: `anyone can update in ${name}`,
                definition: 'TRUE',
                bucket_id: name,
                operation: 'UPDATE'
              });
              
            const deletePolicy = await supabaseAdmin
              .from('storage.policies')
              .insert({
                name: `anyone can delete from ${name}`,
                definition: 'TRUE',
                bucket_id: name,
                operation: 'DELETE'
              });
            
            console.log(`Created policies for bucket ${name} via API`);
            apiSuccess = true;
          } catch (bucketError) {
            console.log(`Could not create policies for ${name} via API:`, bucketError);
          }
        }
        
        if (apiSuccess) {
          policySuccess = true;
        }
      } catch (apiError) {
        console.error("Error creating policies with API method:", apiError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: policySuccess, 
        message: policySuccess 
          ? `Public policies created for bucket: ${bucketName}` 
          : `Attempted to create policies for bucket: ${bucketName}, but could not confirm success`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: policySuccess ? 200 : 207, // Partial success
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
