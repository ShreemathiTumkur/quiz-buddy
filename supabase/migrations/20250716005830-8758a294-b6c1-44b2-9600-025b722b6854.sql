-- Add question_type column to questions table to support different question formats
ALTER TABLE public.questions 
ADD COLUMN question_type TEXT DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank', 'yes_no'));