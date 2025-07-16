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
    const { topicId } = await req.json();

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

    console.log(`Generating questions for topic: ${topic.name}`);

    // Create prompt for OpenAI
    const prompt = `Create exactly 10 educational quiz questions for children aged 6-10 years old about "${topic.name}".

Requirements:
- Each question should be age-appropriate with simple, clear language
- Include exactly 4 multiple choice options (A, B, C, D) for each question
- One option should be clearly correct
- Include a fun, educational fact for each question
- Make questions engaging and educational
- Use vocabulary suitable for elementary school children

Format your response as a JSON array with exactly this structure:
[
  {
    "text": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option B",
    "fun_fact": "Fun educational fact here!"
  }
]

Topic: ${topic.name}
Generate exactly 10 questions now:`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in creating educational content for children. Always respond with valid JSON only, no additional text or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const openAIData = await response.json();
    const generatedContent = openAIData.choices[0].message.content;

    console.log('Generated content:', generatedContent);

    // Parse the JSON response
    let questions;
    try {
      questions = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      return new Response(JSON.stringify({ error: 'Failed to parse generated questions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!Array.isArray(questions) || questions.length !== 10) {
      return new Response(JSON.stringify({ error: 'Generated questions format is invalid' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // First, delete existing questions for this topic
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .eq('topic_id', topicId);

    if (deleteError) {
      console.error('Error deleting existing questions:', deleteError);
    }

    // Insert new questions into database
    const questionsToInsert = questions.map((q: any) => ({
      topic_id: topicId,
      text: q.text,
      options: q.options,
      correct_answer: q.correct_answer,
      fun_fact: q.fun_fact,
      difficulty: 1, // Default difficulty for kids
    }));

    const { data: insertedQuestions, error: insertError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting questions:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to save questions to database' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Successfully generated and saved ${insertedQuestions?.length} questions for ${topic.name}`);

    return new Response(JSON.stringify({ 
      success: true, 
      topicName: topic.name,
      questionsGenerated: insertedQuestions?.length || 0,
      questions: insertedQuestions 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-questions function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});