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
    console.log('Starting generate-questions function');
    const { topicId } = await req.json();
    console.log('Received topicId:', topicId);

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

    // Create comprehensive child-safety prompt for OpenAI
    const prompt = `Create exactly 10 educational quiz questions for children aged 6-10 years old about "${topic.name}".

CRITICAL CHILD SAFETY REQUIREMENTS:
- Content MUST be 100% appropriate for young children (ages 6-10)
- NO scary, violent, inappropriate, or mature content whatsoever
- Use only positive, educational, and age-appropriate language
- Focus on basic, foundational knowledge suitable for elementary school
- Questions should be encouraging and fun, never frightening or disturbing
- All content must be factual, educational, and sourced from reliable children's educational materials

CONTENT GUIDELINES:
- Use simple vocabulary (no words above 4th grade reading level)
- Ask about basic facts, colors, numbers, simple science concepts
- Include only wholesome, educational topics
- Make learning fun and engaging
- Ensure all facts are accurate and verifiable
- No complex or abstract concepts beyond elementary level

QUESTION TYPE VARIETY:
${topic.name.toLowerCase().includes('telugu') ? 
  `For Telugu topics, create ONLY vocabulary questions:
- Ask for Telugu words for simple English words
- Use "voice_input" type for all Telugu questions (children will speak the answer)
- Focus on basic vocabulary: family members, colors, numbers, animals, body parts, food items
- Example: "What is the Telugu word for 'Mother'?" (Answer: "అమ్మ")` :
  `Create a mix of different question types (distribute evenly):
1. Multiple Choice (4 options)
2. True/False 
3. Fill in the blank
4. Yes/No questions`}

SPECIFIC REQUIREMENTS:
- Each question should be age-appropriate with simple, clear language
- Include a fun, educational fact for each question that children would find interesting
- Make questions engaging and educational but never scary or inappropriate
- Use vocabulary and concepts suitable for elementary school children

FORMAT REQUIREMENT:
Format your response as a JSON array with exactly this structure:
[
  {
    "text": "Question text here?",
    "type": "${topic.name.toLowerCase().includes('telugu') ? 'voice_input' : 'multiple_choice|true_false|fill_blank|yes_no|voice_input'}",
    "options": ${topic.name.toLowerCase().includes('telugu') ? 'null' : '["Option A", "Option B", "Option C", "Option D"] OR ["True", "False"] OR ["Yes", "No"] OR null for fill_blank/voice_input'},
    "correct_answer": "The correct answer",
    "fun_fact": "Fun educational fact here!"
  }
]

EXAMPLES:
${topic.name.toLowerCase().includes('telugu') ? `
Telugu Voice Input: {"text": "What is the Telugu word for 'Water'?", "type": "voice_input", "options": null, "correct_answer": "నీరు", "fun_fact": "Water is called 'నీరు' (Neeru) in Telugu, and it's essential for all living things!"}` : `
Multiple Choice: {"text": "What color do you get when you mix red and yellow?", "type": "multiple_choice", "options": ["Purple", "Orange", "Green", "Blue"], "correct_answer": "Orange", "fun_fact": "Orange is a secondary color made by mixing two primary colors!"}

True/False: {"text": "The sun is a star.", "type": "true_false", "options": ["True", "False"], "correct_answer": "True", "fun_fact": "The sun is the closest star to Earth!"}

Fill in blank: {"text": "A group of lions is called a ____.", "type": "fill_blank", "options": null, "correct_answer": "pride", "fun_fact": "Lions live together in family groups called prides!"}

Yes/No: {"text": "Do penguins live at the North Pole?", "type": "yes_no", "options": ["Yes", "No"], "correct_answer": "No", "fun_fact": "Penguins actually live in Antarctica at the South Pole!"}`}

Topic: ${topic.name}
Remember: All content must be completely safe and appropriate for young children. Generate exactly 10 questions${topic.name.toLowerCase().includes('telugu') ? ' focused on basic Telugu vocabulary' : ' with a good mix of question types'} now:`;

    // Call OpenAI API
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
            content: 'You are an expert in creating educational content for children. Always respond with valid JSON only, no additional text or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      console.error(`OpenAI API error: ${response.status} - ${await response.text()}`);
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

    // CHILD SAFETY VALIDATION: Additional content screening
    const validateChildSafety = (text: string): boolean => {
      const inappropriateWords = [
        'scary', 'frightening', 'death', 'kill', 'violence', 'weapon', 'blood', 'hurt', 'pain',
        'fight', 'war', 'bomb', 'gun', 'knife', 'dangerous', 'poison', 'toxic', 'hate',
        'stupid', 'dumb', 'bad', 'evil', 'monster', 'ghost', 'devil', 'hell', 'damn'
      ];
      
      const lowerText = text.toLowerCase();
      // Use word boundaries to avoid false positives like "bad" in "protector"
      return !inappropriateWords.some(word => {
        const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
        return wordRegex.test(lowerText);
      });
    };

    // Validate all generated content for child safety
    for (const question of questions) {
      const questionSafe = validateChildSafety(question.text);
      const funFactSafe = validateChildSafety(question.fun_fact);
      const optionsSafe = question.options ? question.options.every((option: string) => validateChildSafety(option)) : true;
      
      if (!questionSafe) {
        console.error('Question failed validation:', question.text);
      }
      if (!funFactSafe) {
        console.error('Fun fact failed validation:', question.fun_fact);
      }
      if (!optionsSafe) {
        console.error('Options failed validation:', question.options);
      }
      
      if (!questionSafe || !funFactSafe || !optionsSafe) {
        console.error('Generated content failed child safety validation');
        return new Response(JSON.stringify({ 
          error: 'Generated content was not appropriate for children. Please try again.' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    console.log('All generated content passed child safety validation ✅');

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
      question_type: q.type,
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
      console.error('Questions to insert:', JSON.stringify(questionsToInsert, null, 2));
      return new Response(JSON.stringify({ 
        error: 'Failed to save questions to database',
        details: insertError.message 
      }), {
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