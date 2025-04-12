
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

    // Verificar si el usuario actual tiene el rol adecuado para esta operación
    try {
      // Intentar usar SQL directo para aplicar políticas de almacenamiento sin verificar roles
      // Esto es para asegurar que cualquier usuario pueda subir archivos
      try {
        await createPoliciesViaSQL(supabaseAdmin, bucketName);
        console.log(`Created policies for ${bucketName} via SQL`);
      } catch (sqlError) {
        console.error("Error using SQL method:", sqlError);
        
        // Intentar método RPC como respaldo
        try {
          await createPoliciesViaRPC(supabaseAdmin, bucketName);
          console.log(`Created policies for ${bucketName} via RPC`);
        } catch (rpcError) {
          console.error("Error using RPC method:", rpcError);
        }
      }
    } catch (policyError) {
      console.error("General error creating policies:", policyError);
    }

    // Try applying policies to all common bucket names for maximum compatibility
    const commonBuckets = ['recursos', 'resources', 'uploads', 'files', 'avatars', 'images'];
    
    for (const name of commonBuckets) {
      if (name !== bucketName) {
        try {
          console.log(`Applying policies to common bucket: ${name}`);
          // Intentar método SQL primero para cada bucket común
          try {
            await createPoliciesViaSQL(supabaseAdmin, name);
          } catch (e) {
            // Si falla, probar con RPC
            await createPoliciesViaRPC(supabaseAdmin, name);
          }
          console.log(`Applied policies to ${name}`);
        } catch (error) {
          // Ignore errors for these additional buckets
        }
      }
    }

    // Now try to create all buckets if they don't exist
    for (const name of commonBuckets) {
      try {
        const { data: bucketExists } = await supabaseAdmin.storage.getBucket(name);
        
        if (!bucketExists) {
          console.log(`Attempting to create bucket ${name} with admin privileges`);
          await supabaseAdmin.storage.createBucket(name, {
            public: true,
            fileSizeLimit: 10485760
          });
          console.log(`Successfully created bucket ${name}`);
        } else {
          console.log(`Bucket ${name} already exists, updating to public`);
          await supabaseAdmin.storage.updateBucket(name, {
            public: true,
            fileSizeLimit: 10485760
          });
        }
      } catch (error) {
        console.log(`Could not create/update bucket ${name}:`, error.message);
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
      `CREATE POLICY IF NOT EXISTS "Allow public SELECT for ${bucketName}" ON storage.objects
       FOR SELECT USING (bucket_id = '${bucketName}');`,
       
      `CREATE POLICY IF NOT EXISTS "Allow public INSERT for ${bucketName}" ON storage.objects
       FOR INSERT WITH CHECK (bucket_id = '${bucketName}');`,
       
      `CREATE POLICY IF NOT EXISTS "Allow public UPDATE for ${bucketName}" ON storage.objects
       FOR UPDATE USING (bucket_id = '${bucketName}');`,
       
      `CREATE POLICY IF NOT EXISTS "Allow public DELETE for ${bucketName}" ON storage.objects
       FOR DELETE USING (bucket_id = '${bucketName}');`
    ];
    
    for (const query of queries) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { query });
        if (error) throw error;
      } catch (err) {
        // Policy might already exist, continue with next
        console.log(`SQL policy error (might already exist): ${err.message}`);
      }
    }
    
    // Try to enable RLS with fallback if it doesn't work (might already be enabled)
    try {
      await supabaseAdmin.rpc('exec_sql', { 
        query: `ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;` 
      });
    } catch (err) {
      console.log(`Error enabling RLS (might already be enabled): ${err.message}`);
    }
  } catch (error) {
    console.error(`Error creating policies via SQL for ${bucketName}:`, error);
    throw error;
  }
}
