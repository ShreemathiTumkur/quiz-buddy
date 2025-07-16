-- Insert default starter topics for Quiz Buddy (if they don't already exist)
DO $$
BEGIN
  -- Insert Math (Age 6) if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.topics WHERE name = 'Math (Age 6)') THEN
    INSERT INTO public.topics (name, emoji) VALUES ('Math (Age 6)', '🔢');
  END IF;
  
  -- Insert Science if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.topics WHERE name = 'Science') THEN
    INSERT INTO public.topics (name, emoji) VALUES ('Science', '🔬');
  END IF;
  
  -- Insert Telugu Vocabulary if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.topics WHERE name = 'Telugu Vocabulary') THEN
    INSERT INTO public.topics (name, emoji) VALUES ('Telugu Vocabulary', '📚');
  END IF;
  
  -- Insert Animals if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.topics WHERE name = 'Animals') THEN
    INSERT INTO public.topics (name, emoji) VALUES ('Animals', '🐾');
  END IF;
END $$;