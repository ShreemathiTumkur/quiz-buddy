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
    console.log('Starting question generation');
    
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

    let questionsToInsert;

    // Try to use OpenAI for question generation if API key is available
    if (openAIApiKey) {
      console.log('Using OpenAI for question generation');
      
      try {
        const prompt = `Generate exactly 10 factual quiz questions for children aged 6-10 about "${topic.name}".

        Requirements:
        - Age-appropriate FACTUAL content for 6-10 year olds
        - Only ask questions with definitive, factual answers (no opinions or preferences)
        - Include multiple choice questions with 4 options each
        - Focus on facts, numbers, names, dates, science facts, etc.
        - Include one educational fact for each question
        - Return valid JSON format
        - Make questions factual and educational

        Response format:
        [
          {
            "text": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "Option A",
            "fun_fact": "Educational fact about the answer"
          }
        ]`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are an educational content creator specializing in age-appropriate quiz questions for children. Always return valid JSON.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.choices[0].message.content;
        
        // Parse the JSON response
        const generatedQuestions = JSON.parse(generatedText);
        
        questionsToInsert = generatedQuestions.map((q: any) => ({
          topic_id: topicId,
          text: q.text,
          question_type: 'multiple_choice',
          options: q.options,
          correct_answer: q.correct_answer,
          fun_fact: q.fun_fact,
          difficulty: 1,
        }));

        console.log(`Generated ${questionsToInsert.length} questions using OpenAI`);

      } catch (aiError) {
        console.error('OpenAI generation failed:', aiError);
        console.log('Falling back to hardcoded questions');
        questionsToInsert = getFallbackQuestions(topic, topicId);
      }
    } else {
      console.log('No OpenAI API key, using fallback questions');
      questionsToInsert = getFallbackQuestions(topic, topicId);
    }

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
    console.log('Inserting questions...');
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

    console.log(`Successfully saved ${insertedQuestions?.length} questions`);

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

function getFallbackQuestions(topic: any, topicId: string) {
  const topicName = topic.name.toLowerCase();
  
  if (topicName.includes('math')) {
    return [
      {
        topic_id: topicId,
        text: "What is 7 + 5?",
        question_type: "multiple_choice",
        options: ["10", "12", "14", "11"],
        correct_answer: "12",
        fun_fact: "Addition helps us count things together!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "What is 8 × 3?",
        question_type: "multiple_choice",
        options: ["21", "24", "18", "27"],
        correct_answer: "24",
        fun_fact: "Multiplication is like adding the same number multiple times!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "What is 15 - 7?",
        question_type: "multiple_choice",
        options: ["8", "9", "7", "6"],
        correct_answer: "8",
        fun_fact: "Subtraction helps us find the difference between numbers!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "How many sides does a triangle have?",
        question_type: "multiple_choice",
        options: ["2", "3", "4", "5"],
        correct_answer: "3",
        fun_fact: "A triangle is the strongest shape in construction!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "What comes after 19?",
        question_type: "multiple_choice",
        options: ["18", "20", "21", "22"],
        correct_answer: "20",
        fun_fact: "Counting helps us organize and understand numbers!",
        difficulty: 1,
      }
    ];
  }
  
  if (topicName.includes('science')) {
    return [
      {
        topic_id: topicId,
        text: "What do plants need to grow?",
        question_type: "multiple_choice",
        options: ["Water and sunlight", "Only water", "Only soil", "Only air"],
        correct_answer: "Water and sunlight",
        fun_fact: "Plants use sunlight to make their own food through photosynthesis!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "What is the largest planet in our solar system?",
        question_type: "multiple_choice",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correct_answer: "Jupiter",
        fun_fact: "Jupiter is so big that all other planets could fit inside it!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "What do we breathe in to stay alive?",
        question_type: "multiple_choice",
        options: ["Carbon dioxide", "Oxygen", "Water", "Nitrogen"],
        correct_answer: "Oxygen",
        fun_fact: "Trees and plants make the oxygen we breathe!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "What causes rain?",
        question_type: "multiple_choice",
        options: ["Clouds cooling down", "Wind blowing", "The sun shining", "Mountains moving"],
        correct_answer: "Clouds cooling down",
        fun_fact: "Water evaporates, forms clouds, then falls back down as rain!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "What is the center of an atom called?",
        question_type: "multiple_choice",
        options: ["Electron", "Proton", "Nucleus", "Neutron"],
        correct_answer: "Nucleus",
        fun_fact: "Everything around us is made of tiny atoms!",
        difficulty: 1,
      }
    ];
  }

  // Factual questions for Volcanoes
  if (topicName.includes('volcano')) {
    return [
      {
        topic_id: topicId,
        text: "What comes out of a volcano when it erupts?",
        question_type: "multiple_choice",
        options: ["Water", "Lava", "Ice", "Sand"],
        correct_answer: "Lava",
        fun_fact: "Lava is melted rock that can reach temperatures of over 2,000°F!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "What is the ring of volcanoes around the Pacific Ocean called?",
        question_type: "multiple_choice",
        options: ["Ring of Fire", "Circle of Mountains", "Ocean Ring", "Pacific Circle"],
        correct_answer: "Ring of Fire",
        fun_fact: "The Ring of Fire has about 75% of the world's active volcanoes!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "What type of rock is formed when lava cools down?",
        question_type: "multiple_choice",
        options: ["Sedimentary", "Metamorphic", "Igneous", "Limestone"],
        correct_answer: "Igneous",
        fun_fact: "Igneous rocks like obsidian and pumice are created by volcanic activity!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "What is the opening at the top of a volcano called?",
        question_type: "multiple_choice",
        options: ["Crater", "Summit", "Peak", "Hole"],
        correct_answer: "Crater",
        fun_fact: "Some volcano craters are so big they can hold entire lakes!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "Which country has the most active volcanoes?",
        question_type: "multiple_choice",
        options: ["Italy", "Indonesia", "Japan", "Iceland"],
        correct_answer: "Indonesia",
        fun_fact: "Indonesia has over 130 active volcanoes!",
        difficulty: 1,
      }
    ];
  }

  // Factual questions for Geography
  if (topicName.includes('geography')) {
    return [
      {
        topic_id: topicId,
        text: "What is the largest continent?",
        question_type: "multiple_choice",
        options: ["Africa", "Asia", "North America", "Europe"],
        correct_answer: "Asia",
        fun_fact: "Asia covers about 30% of Earth's total land area!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "How many continents are there?",
        question_type: "multiple_choice",
        options: ["5", "6", "7", "8"],
        correct_answer: "7",
        fun_fact: "The seven continents are Asia, Africa, North America, South America, Antarctica, Europe, and Australia!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "What is the longest river in the world?",
        question_type: "multiple_choice",
        options: ["Amazon River", "Nile River", "Mississippi River", "Yangtze River"],
        correct_answer: "Nile River",
        fun_fact: "The Nile River is about 4,135 miles long!",
        difficulty: 1,
      }
    ];
  }

  // Factual questions for Animals
  if (topicName.includes('animals')) {
    return [
      {
        topic_id: topicId,
        text: "What is the largest animal on Earth?",
        question_type: "multiple_choice",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        correct_answer: "Blue Whale",
        fun_fact: "A blue whale's heart alone can weigh as much as a car!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "How many legs does a spider have?",
        question_type: "multiple_choice",
        options: ["6", "8", "10", "12"],
        correct_answer: "8",
        fun_fact: "All spiders have 8 legs, which helps scientists identify them!",
        difficulty: 1,
      },
      {
        topic_id: topicId,
        text: "What do pandas mainly eat?",
        question_type: "multiple_choice",
        options: ["Fish", "Meat", "Bamboo", "Fruits"],
        correct_answer: "Bamboo",
        fun_fact: "Pandas eat about 26-84 pounds of bamboo every day!",
        difficulty: 1,
      }
    ];
  }

  // For topics we don't have specific questions for, generate topic-relevant questions
  return [
    {
      topic_id: topicId,
      text: `What is ${topic.name} related to?`,
      question_type: "multiple_choice",
      options: ["Learning and education", "Nothing important", "Only adults", "Boring stuff"],
      correct_answer: "Learning and education",
      fun_fact: `${topic.name} is a fascinating subject with many interesting facts to discover!`,
      difficulty: 1,
    },
    {
      topic_id: topicId,
      text: `How can we learn more about ${topic.name}?`,
      question_type: "multiple_choice",
      options: ["Reading books", "Asking questions", "Observing carefully", "All of these"],
      correct_answer: "All of these",
      fun_fact: `There are many ways to explore and understand ${topic.name}!`,
      difficulty: 1,
    },
    {
      topic_id: topicId,
      text: `What makes ${topic.name} interesting to study?`,
      question_type: "multiple_choice",
      options: ["It teaches us facts", "It helps us understand", "It's educational", "All of these"],
      correct_answer: "All of these",
      fun_fact: `Every subject like ${topic.name} has amazing facts waiting to be discovered!`,
      difficulty: 1,
    }
  ];
}