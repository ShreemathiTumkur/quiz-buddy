import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting generate-questions function');
    
    const { topicId } = await req.json();
    console.log('📥 Received topicId:', topicId);

    if (!topicId) {
      return new Response(JSON.stringify({ error: 'Topic ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get topic details
    const { data: topic, error: topicError } = await supabase
      .from('topics')
      .select('id, name, emoji')
      .eq('id', topicId)
      .single();

    if (topicError || !topic) {
      return new Response(JSON.stringify({ error: 'Topic not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`✅ Topic found: ${topic.name}`);

    // Simple prompt for Telugu
    const prompt = `Create exactly 5 simple Telugu vocabulary questions for children. 
Each question should ask for the Telugu word for a common English word.

Format as JSON array:
[
  {
    "text": "What is the Telugu word for 'Water'?",
    "type": "voice_input",
    "options": null,
    "correct_answer": "నీరు",
    "fun_fact": "Water is essential for all life!"
  }
]

Create 5 questions about basic Telugu vocabulary like water, mother, father, sun, tree.`;

    // Call OpenAI API
    console.log('🤖 Calling OpenAI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in creating educational content for children. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ OpenAI error: ${response.status} - ${errorText}`);
      return new Response(JSON.stringify({ 
        error: `OpenAI API error: ${response.status}`,
        details: errorText 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIData = await response.json();
    const generatedContent = openAIData.choices[0].message.content;
    console.log('📝 Generated content:', generatedContent);

    // Parse the JSON response
    let questions;
    try {
      questions = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Failed to parse generated questions',
        details: parseError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!Array.isArray(questions) || questions.length !== 5) {
      console.error(`❌ Expected 5 questions, got ${questions.length}`);
      return new Response(JSON.stringify({ 
        error: 'Generated questions format is invalid',
        details: `Expected 5 questions, got ${questions.length}` 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Delete existing questions for this topic
    console.log('🗑️ Deleting existing questions...');
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .eq('topic_id', topicId);

    if (deleteError) {
      console.error('⚠️ Error deleting existing questions:', deleteError);
    }

    // Insert new questions into database
    console.log('💾 Inserting questions...');
    const questionsToInsert = questions.map((q: any) => ({
      topic_id: topicId,
      text: q.text,
      question_type: q.type,
      options: q.options,
      correct_answer: q.correct_answer,
      fun_fact: q.fun_fact,
      difficulty: 1,
    }));

    const { data: insertedQuestions, error: insertError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select();

    if (insertError) {
      console.error('❌ Error inserting questions:', insertError);
      return new Response(JSON.stringify({ 
        error: 'Failed to save questions to database',
        details: insertError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`🎉 Successfully saved ${insertedQuestions?.length} questions`);

    return new Response(JSON.stringify({ 
      success: true, 
      topicName: topic.name,
      questionsGenerated: insertedQuestions?.length || 0,
      questions: insertedQuestions 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Function error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: error instanceof Error ? error.stack : 'No stack trace'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});