-- Enable Row Level Security on topics table
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- Create policies for topics (readable by everyone, since it's a quiz app)
CREATE POLICY "Topics are viewable by everyone" 
ON public.topics 
FOR SELECT 
USING (true);

-- Enable Row Level Security on questions table  
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create policies for questions (readable by everyone, since it's a quiz app)
CREATE POLICY "Questions are viewable by everyone" 
ON public.questions 
FOR SELECT 
USING (true);