-- Add policies for topics table to allow users to insert and manage topics
CREATE POLICY "Users can insert topics" 
ON public.topics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update topics" 
ON public.topics 
FOR UPDATE 
USING (true);

-- Add policies for questions table to allow the edge function to insert/update questions
CREATE POLICY "Service role can insert questions" 
ON public.questions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can update questions" 
ON public.questions 
FOR UPDATE 
USING (true);

CREATE POLICY "Service role can delete questions" 
ON public.questions 
FOR DELETE 
USING (true);