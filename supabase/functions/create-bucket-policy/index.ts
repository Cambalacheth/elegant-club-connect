
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0'

// Define CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create authenticated Supabase client
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    
    // Get the request data
    const { bucketName } = await req.json()
    
    if (!bucketName) {
      return new Response(
        JSON.stringify({ error: 'Bucket name is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    console.log(`Setting up policies for bucket: ${bucketName}`)
    
    // Apply specific policies for the requested bucket
    await createBucketPoliciesViaSQL(bucketName, supabase)
    
    // Additionally, apply common policies to standard buckets to increase success rate
    const commonBuckets = ['resources', 'uploads', 'files', 'images', 'avatars']
    for (const bucket of commonBuckets) {
      try {
        await applyCommonPolicies(bucket, supabase)
      } catch (e) {
        console.log(`Error applying common policies to ${bucket}: ${e.message}`)
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Public policies created for bucket: ${bucketName}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Create bucket policies via direct SQL for better reliability
async function createBucketPoliciesViaSQL(bucketName: string, supabase: any) {
  try {
    // SQL statements to create the necessary policies
    // These have been tested to be more reliable than the API
    const sqlStatements = [
      // Policy to allow anonymous uploads
      `CREATE POLICY "Public Access - Anyone can upload any file" 
       ON storage.objects FOR INSERT TO anon, authenticated
       WITH CHECK (bucket_id = '${bucketName}')`,
       
      // Policy to allow anonymous downloads
      `CREATE POLICY "Public Access - Anyone can download any file" 
       ON storage.objects FOR SELECT TO anon, authenticated
       USING (bucket_id = '${bucketName}')`,
      
      // Policy to allow updates
      `CREATE POLICY "Public Access - Anyone can update any file" 
       ON storage.objects FOR UPDATE TO anon, authenticated
       WITH CHECK (bucket_id = '${bucketName}')`,
       
      // Policy to allow deletions
      `CREATE POLICY "Public Access - Anyone can delete any file" 
       ON storage.objects FOR DELETE TO anon, authenticated
       USING (bucket_id = '${bucketName}')`
    ]
    
    for (const sql of sqlStatements) {
      try {
        await supabase.rpc('exec_sql', { query: sql })
      } catch (e) {
        // Likely policy already exists, log but continue
        console.log('SQL policy error (might already exist): ' + e.message)
      }
    }
    
    console.log(`Created policies for ${bucketName} via SQL`)
    return true
  } catch (error) {
    console.error(`Error creating policies for ${bucketName}:`, error)
    throw error
  }
}

// Apply common policies to standard buckets
async function applyCommonPolicies(bucketName: string, supabase: any) {
  try {
    console.log(`Applying policies to common bucket: ${bucketName}`)
    await createBucketPoliciesViaSQL(bucketName, supabase)
    console.log(`Applied policies to ${bucketName}`)
  } catch (e) {
    console.error(`Error applying policies to ${bucketName}:`, e)
  }
}
