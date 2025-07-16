-- Add options and correct_answer columns to questions table
ALTER TABLE public.questions 
ADD COLUMN options TEXT[], 
ADD COLUMN correct_answer TEXT;

-- Add some sample data for testing
INSERT INTO public.topics (id, name, emoji) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Math', '🔢'),
('550e8400-e29b-41d4-a716-446655440002', 'Science', '🔬'),
('550e8400-e29b-41d4-a716-446655440003', 'Animals', '🐾')
ON CONFLICT (id) DO NOTHING;

-- Add sample questions
INSERT INTO public.questions (id, topic_id, text, options, correct_answer, fun_fact) VALUES 
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'What is 2 + 2?', ARRAY['3', '4', '5', '6'], '4', 'Addition is one of the basic arithmetic operations!'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'What is 5 × 3?', ARRAY['12', '15', '18', '20'], '15', 'Multiplication is repeated addition!'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'What planet is closest to the Sun?', ARRAY['Venus', 'Mercury', 'Earth', 'Mars'], 'Mercury', 'Mercury is so close to the Sun that a day there lasts 88 Earth days!'),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'What sound does a cat make?', NULL, 'meow', 'Cats have over 100 different vocalizations!'),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'What is 10 - 3?', ARRAY['6', '7', '8', '9'], '7', 'Subtraction is the opposite of addition!'),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'What do plants need to grow?', ARRAY['Only water', 'Only sunlight', 'Water and sunlight', 'Just soil'], 'Water and sunlight', 'Plants make their own food through photosynthesis!'),
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'How many legs does a spider have?', ARRAY['6', '8', '10', '12'], '8', 'All spiders have 8 legs - that makes them arachnids, not insects!'),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', 'What is half of 8?', ARRAY['3', '4', '5', '6'], '4', 'Half means dividing by 2!'),
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', 'What is the largest planet in our solar system?', ARRAY['Earth', 'Saturn', 'Jupiter', 'Neptune'], 'Jupiter', 'Jupiter is so big that all other planets could fit inside it!'),
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'What color is an elephant?', NULL, 'gray', 'Elephants are the largest land animals on Earth!')
ON CONFLICT (id) DO NOTHING;