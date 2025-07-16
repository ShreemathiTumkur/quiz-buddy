-- Insert default starter topics for Quiz Buddy
INSERT INTO public.topics (name, emoji) VALUES
  ('Math (Age 6)', '🔢'),
  ('Science', '🔬'),
  ('Telugu Vocabulary', '📚'),
  ('Animals', '🐾')
ON CONFLICT (name) DO NOTHING;