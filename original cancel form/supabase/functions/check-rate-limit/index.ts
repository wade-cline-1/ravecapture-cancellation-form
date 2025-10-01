import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP address
    const clientIP = req.headers.get('x-real-ip') || 
                    req.headers.get('x-forwarded-for') || 
                    '0.0.0.0';

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Check for existing attempts in last 24 hours
    const { data: attempts, error: queryError } = await supabaseClient
      .from('submission_attempts')
      .select('attempted_at')
      .eq('ip_address', clientIP)
      .gte('attempted_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('attempted_at', { ascending: false });

    if (queryError) {
      throw queryError;
    }

    // Allow only 3 attempts per 24 hours
    const isAllowed = !attempts || attempts.length < 3;

    // Record this attempt
    if (isAllowed) {
      const { error: insertError } = await supabaseClient
        .from('submission_attempts')
        .insert([{
          ip_address: clientIP,
          attempted_at: new Date().toISOString(),
          was_successful: true
        }]);

      if (insertError) {
        throw insertError;
      }
    }

    // Return result
    return new Response(
      JSON.stringify({
        allowed: isAllowed,
        attemptsRemaining: Math.max(0, 3 - (attempts?.length || 0)),
        nextAttemptAllowed: attempts?.[2]?.attempted_at 
          ? new Date(new Date(attempts[2].attempted_at).getTime() + 24 * 60 * 60 * 1000).toISOString()
          : null
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});