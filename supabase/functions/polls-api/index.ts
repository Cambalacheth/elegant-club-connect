
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Crear cliente de Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Manejar preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Obtener la URL y extraer la ruta
  const url = new URL(req.url);
  const path = url.pathname.split('/').filter(Boolean);
  
  // Verificar que la ruta comience con 'polls-api'
  if (path[0] !== 'polls-api') {
    return new Response(JSON.stringify({ error: 'Ruta inválida' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Rutas para encuestas
    if (path[1] === 'polls') {
      // GET /polls - Obtener todas las encuestas
      if (req.method === 'GET' && path.length === 2) {
        const { data, error } = await supabase
          .from('polls')
          .select('*, poll_options(*)');
          
        if (error) throw error;
        
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // GET /polls/{id} - Obtener una encuesta específica
      if (req.method === 'GET' && path.length === 3) {
        const pollId = path[2];
        
        const { data, error } = await supabase
          .from('polls')
          .select('*, poll_options(*)')
          .eq('id', pollId)
          .single();
          
        if (error) throw error;
        
        // Obtener estadísticas de votos por opción
        const { data: voteStats, error: voteError } = await supabase
          .from('poll_votes')
          .select('option_id, count')
          .eq('poll_id', pollId)
          .group_by('option_id');
          
        if (voteError) throw voteError;
        
        // Añadir estadísticas de votos a las opciones
        data.poll_options = data.poll_options.map(option => {
          const stats = voteStats.find(stat => stat.option_id === option.id);
          return {
            ...option,
            vote_count: stats?.count || 0
          };
        });
        
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // POST /polls - Crear una nueva encuesta
      if (req.method === 'POST' && path.length === 2) {
        const requestData = await req.json();
        
        // Validar datos
        if (!requestData.title || !Array.isArray(requestData.options) || requestData.options.length < 2) {
          return new Response(JSON.stringify({ 
            error: 'Datos de encuesta inválidos. Se requiere título y al menos 2 opciones.' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        // Insertar encuesta
        const { data: poll, error: pollError } = await supabase
          .from('polls')
          .insert({
            title: requestData.title,
            description: requestData.description || null,
            show_results: requestData.showResults !== false // Por defecto true
          })
          .select()
          .single();
          
        if (pollError) throw pollError;
        
        // Insertar opciones
        const options = requestData.options.map(option => ({
          poll_id: poll.id,
          text: option
        }));
        
        const { data: pollOptions, error: optionsError } = await supabase
          .from('poll_options')
          .insert(options)
          .select();
          
        if (optionsError) throw optionsError;
        
        // Devolver encuesta completa
        return new Response(JSON.stringify({ 
          ...poll, 
          poll_options: pollOptions 
        }), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
    
    // POST /vote - Registrar un voto
    if (path[1] === 'vote' && req.method === 'POST') {
      const { pollId, optionId, userId } = await req.json();
      
      // Validar datos
      if (!pollId || !optionId || !userId) {
        return new Response(JSON.stringify({ 
          error: 'Datos de voto inválidos. Se requiere pollId, optionId y userId.' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Verificar si el usuario ya votó en esta encuesta
      const { data: existingVotes, error: checkError } = await supabase
        .from('poll_votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_identifier', userId);
        
      if (checkError) throw checkError;
      
      if (existingVotes && existingVotes.length > 0) {
        return new Response(JSON.stringify({ 
          error: 'Ya has votado en esta encuesta.',
          alreadyVoted: true 
        }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Verificar que la opción pertenece a la encuesta
      const { data: optionCheck, error: optionError } = await supabase
        .from('poll_options')
        .select('id')
        .eq('id', optionId)
        .eq('poll_id', pollId);
        
      if (optionError) throw optionError;
      
      if (!optionCheck || optionCheck.length === 0) {
        return new Response(JSON.stringify({ 
          error: 'La opción seleccionada no pertenece a esta encuesta.' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Registrar voto
      const { data: vote, error: voteError } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: pollId,
          option_id: optionId,
          user_identifier: userId
        })
        .select();
        
      if (voteError) throw voteError;
      
      // Obtener resultados actualizados
      const { data: results, error: resultsError } = await supabase
        .from('poll_votes')
        .select('option_id, count(*)')
        .eq('poll_id', pollId)
        .group_by('option_id');
        
      if (resultsError) throw resultsError;
      
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Voto registrado correctamente',
        results
      }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Ruta no encontrada
    return new Response(JSON.stringify({ error: 'Endpoint no encontrado' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error en API de encuestas:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
