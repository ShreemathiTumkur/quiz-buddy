import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles, RefreshCw, Plus, BookOpen } from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  emoji: string;
}

interface QuestionGeneratorProps {
  topics: Topic[];
  onQuestionsGenerated: () => void;
  onTopicsUpdated: () => void;
}

export const QuestionGenerator = ({ topics, onQuestionsGenerated, onTopicsUpdated }: QuestionGeneratorProps) => {
  const [generatingTopics, setGeneratingTopics] = useState<Set<string>>(new Set());
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicEmoji, setNewTopicEmoji] = useState('');
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

  const addNewTopic = async () => {
    if (!newTopicName.trim() || !newTopicEmoji.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both topic name and emoji",
        variant: "destructive",
      });
      return;
    }

    setIsAddingTopic(true);
    try {
      const { data, error } = await supabase
        .from('topics')
        .insert([
          {
            name: newTopicName.trim(),
            emoji: newTopicEmoji.trim()
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Topic Added! 🎉",
        description: `${newTopicEmoji} ${newTopicName} has been added successfully`,
      });

      setNewTopicName('');
      setNewTopicEmoji('');
      onTopicsUpdated();

    } catch (error) {
      console.error('Error adding topic:', error);
      toast({
        title: "Error adding topic",
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: "destructive",
      });
    } finally {
      setIsAddingTopic(false);
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
        {/* Add New Topic Section */}
        <Card className="border-dashed border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Topic
              </h3>
              <p className="text-sm text-muted-foreground">
                Create new learning topics like Science, Animals, or anything you want!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Topic name (e.g., Science, Animals)"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  disabled={isAddingTopic}
                />
              </div>
              <div className="w-20">
                <Input
                  placeholder="🔬"
                  value={newTopicEmoji}
                  onChange={(e) => setNewTopicEmoji(e.target.value)}
                  disabled={isAddingTopic}
                  className="text-center"
                />
              </div>
              <Button
                onClick={addNewTopic}
                disabled={isAddingTopic || !newTopicName.trim() || !newTopicEmoji.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {isAddingTopic ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Topic
                  </>
                )}
              </Button>
            </div>
            
            {/* Quick Add Buttons for Popular Topics */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewTopicName('Science');
                  setNewTopicEmoji('🔬');
                }}
                disabled={isAddingTopic}
              >
                🔬 Science
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewTopicName('Animals');
                  setNewTopicEmoji('🐾');
                }}
                disabled={isAddingTopic}
              >
                🐾 Animals
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewTopicName('Geography');
                  setNewTopicEmoji('🌍');
                }}
                disabled={isAddingTopic}
              >
                🌍 Geography
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generate All Button */}
        <div className="text-center">
          <Button 
            onClick={generateAllQuestions}
            disabled={isGeneratingAny || topics.length === 0}
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