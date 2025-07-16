import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles, RefreshCw } from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  emoji: string;
}

interface QuestionGeneratorProps {
  topics: Topic[];
  onQuestionsGenerated: () => void;
}

export const QuestionGenerator = ({ topics, onQuestionsGenerated }: QuestionGeneratorProps) => {
  const [generatingTopics, setGeneratingTopics] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const generateQuestionsForTopic = async (topicId: string, topicName: string) => {
    setGeneratingTopics(prev => new Set(prev).add(topicId));

    try {
      const { data, error } = await supabase.functions.invoke('generate-questions', {
        body: { topicId }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Questions Generated! 🎉",
        description: `Successfully created ${data.questionsGenerated} new questions for ${topicName}`,
      });

      onQuestionsGenerated();

    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Error generating questions",
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: "destructive",
      });
    } finally {
      setGeneratingTopics(prev => {
        const newSet = new Set(prev);
        newSet.delete(topicId);
        return newSet;
      });
    }
  };

  const generateAllQuestions = async () => {
    for (const topic of topics) {
      if (!generatingTopics.has(topic.id)) {
        await generateQuestionsForTopic(topic.id, topic.name);
        // Small delay between generations to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const isGeneratingAny = generatingTopics.size > 0;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Question Generator
        </CardTitle>
        <p className="text-muted-foreground">
          Generate fresh, age-appropriate questions for each topic using AI. Each topic will get exactly 10 new questions with multiple choice answers and fun facts!
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Generate All Button */}
        <div className="text-center">
          <Button 
            onClick={generateAllQuestions}
            disabled={isGeneratingAny}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGeneratingAny ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Questions for All Topics
              </>
            )}
          </Button>
        </div>

        {/* Individual Topic Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => {
            const isGenerating = generatingTopics.has(topic.id);
            
            return (
              <div 
                key={topic.id} 
                className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{topic.emoji}</span>
                  <span className="font-medium">{topic.name}</span>
                </div>
                <Button
                  onClick={() => generateQuestionsForTopic(topic.id, topic.name)}
                  disabled={isGenerating || isGeneratingAny}
                  variant="outline"
                  size="sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {topics.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No topics available. Please add some topics first!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};