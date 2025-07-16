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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Telugu question generation');
    
    const { topicId } = await req.json();
    console.log('TopicId:', topicId);

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

    console.log(`Topic: ${topic.name}`);

    // Check if this is a Math topic and use appropriate questions
    if (topic.name.toLowerCase().includes('math')) {
      // For Math topics, create more challenging math questions
      const mathQuestions = [
        {
          text: "What is 1,247 + 856?",
          type: "fill_blank",
          options: null,
          correct_answer: "2103",
          fun_fact: "When adding large numbers, line up the digits by place value!"
        },
        {
          text: "What is 3,421 - 1,789?",
          type: "fill_blank", 
          options: null,
          correct_answer: "1632",
          fun_fact: "Sometimes you need to borrow from the next column when subtracting!"
        },
        {
          text: "What is 567 + 834?",
          type: "multiple_choice",
          options: ["1401", "1301", "1201", "1501"],
          correct_answer: "1401",
          fun_fact: "Adding hundreds, tens, and ones separately can help you get the right answer!"
        },
        {
          text: "What is 2,000 - 456?",
          type: "fill_blank",
          options: null,
          correct_answer: "1544", 
          fun_fact: "When subtracting from numbers ending in zeros, you might need to borrow several times!"
        },
        {
          text: "What is 7 × 8?",
          type: "multiple_choice",
          options: ["54", "56", "58", "52"],
          correct_answer: "56",
          fun_fact: "Multiplication tables help you solve problems quickly!"
        },
        {
          text: "What is 9 × 6?",
          type: "fill_blank",
          options: null,
          correct_answer: "54",
          fun_fact: "You can think of 9 × 6 as (10 × 6) - 6 = 60 - 6 = 54!"
        },
        {
          text: "What is 42 ÷ 7?",
          type: "multiple_choice",
          options: ["5", "6", "7", "8"],
          correct_answer: "6",
          fun_fact: "Division is the opposite of multiplication: 6 × 7 = 42!"
        },
        {
          text: "What is 81 ÷ 9?",
          type: "fill_blank",
          options: null,
          correct_answer: "9",
          fun_fact: "When you divide a number by itself, you always get 1, but 81 ÷ 9 = 9!"
        },
        {
          text: "What is 1,458 + 697?",
          type: "fill_blank",
          options: null,
          correct_answer: "2155",
          fun_fact: "Always start adding from the ones place and work your way left!"
        },
        {
          text: "What is 4 × 9?",
          type: "multiple_choice",
          options: ["35", "36", "37", "38"],
          correct_answer: "36",
          fun_fact: "4 × 9 is the same as 4 groups of 9 things each!"
        }
      ];

      // Delete existing questions for this topic
      console.log('Deleting existing questions...');
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('topic_id', topicId);

      if (deleteError) {
        console.error('Error deleting existing questions:', deleteError);
      }

      // Insert new questions into database
      console.log('Inserting Math questions...');
      const questionsToInsert = mathQuestions.map((q) => ({
        topic_id: topicId,
        text: q.text,
        question_type: q.type,
        options: q.options,
        correct_answer: q.correct_answer,
        fun_fact: q.fun_fact,
        difficulty: 2, // Higher difficulty for Math
      }));

      const { data: insertedQuestions, error: insertError } = await supabase
        .from('questions')
        .insert(questionsToInsert)
        .select();

      if (insertError) {
        console.error('Error inserting questions:', insertError);
        return new Response(JSON.stringify({ 
          error: 'Failed to save questions to database',
          details: insertError.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`Successfully saved ${insertedQuestions?.length} Math questions`);

      return new Response(JSON.stringify({ 
        success: true, 
        topicName: topic.name,
        questionsGenerated: insertedQuestions?.length || 0,
        questions: insertedQuestions 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For Telugu, create hardcoded questions to avoid OpenAI issues
    const teluguQuestions = [
      {
        text: "What is the Telugu word for 'Water'?",
        type: "voice_input",
        options: null,
        correct_answer: "నీరు",
        fun_fact: "Water is called 'నీరు' (Neeru) in Telugu, and it's essential for all living things!"
      },
      {
        text: "What is the Telugu word for 'Mother'?",
        type: "voice_input", 
        options: null,
        correct_answer: "అమ్మ",
        fun_fact: "In Telugu, we call our mothers 'అమ్మ' (Amma), which shows love and respect!"
      },
      {
        text: "What is the Telugu word for 'Father'?",
        type: "voice_input",
        options: null,
        correct_answer: "నాన్న",
        fun_fact: "In Telugu, 'Father' is called 'నాన్న' (Nanna), and fathers are very special!"
      },
      {
        text: "What is the Telugu word for 'Sun'?",
        type: "voice_input",
        options: null,
        correct_answer: "సూర్యుడు",
        fun_fact: "In Telugu, 'Sun' is called 'సూర్యుడు' (Suryudu), and it gives us light and warmth!"
      },
      {
        text: "What is the Telugu word for 'Tree'?",
        type: "voice_input",
        options: null,
        correct_answer: "చెట్టు",
        fun_fact: "A 'Tree' is called 'చెట్టు' (Chettu) in Telugu, and trees provide shade and oxygen!"
      }
    ];

    // Delete existing questions for this topic
    console.log('Deleting existing questions...');
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .eq('topic_id', topicId);

    if (deleteError) {
      console.error('Error deleting existing questions:', deleteError);
    }

    // Insert new questions into database
    console.log('Inserting Telugu questions...');
    const questionsToInsert = teluguQuestions.map((q) => ({
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
      console.error('Error inserting questions:', insertError);
      return new Response(JSON.stringify({ 
        error: 'Failed to save questions to database',
        details: insertError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Successfully saved ${insertedQuestions?.length} Telugu questions`);

    return new Response(JSON.stringify({ 
      success: true, 
      topicName: topic.name,
      questionsGenerated: insertedQuestions?.length || 0,
      questions: insertedQuestions 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});