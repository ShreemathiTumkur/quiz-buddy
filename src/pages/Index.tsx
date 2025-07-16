import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TopicButton } from '@/components/TopicButton';
import { TopicsGridSkeleton } from '@/components/TopicSkeleton';
import { ChatTab } from '@/components/ChatTab';
import { NamePrompt } from '@/components/NamePrompt';
import UserProfile from '@/components/UserProfile';
import { QuestionGenerator } from '@/components/QuestionGenerator';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, LogIn, Settings, Play } from 'lucide-react';
import quizBuddyLogo from '@/assets/quiz-buddy-logo.png';

interface DbTopic {
  id: string;
  name: string;
  emoji: string;
}

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [topics, setTopics] = useState<DbTopic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('play');

  // Fetch topics from Supabase
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setTopicsLoading(true);
        const { data, error } = await supabase
          .from('topics')
          .select('id, name, emoji')
          .order('name');
        
        if (error) {
          console.error('Error fetching topics:', error);
        } else {
          setTopics(data || []);
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setTopicsLoading(false);
      }
    };

    if (user) {
      fetchTopics();
    }
  }, [user]);

  const handleQuestionsGenerated = () => {
    // Trigger a re-fetch of topics or show a success message
    // The questions are already updated in the database
  };

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleTopicSelect = (topicId: string) => {
    navigate(`/quiz/${topicId}`);
  };

  // Show loading spinner while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Quiz Buddy</h1>
          <p className="text-lg text-muted-foreground mb-6">Please sign in to start your learning adventure!</p>
          <Button onClick={() => navigate('/auth')} size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Show name prompt if user doesn't have a display name
  if (!profile?.display_name) {
    return <NamePrompt onComplete={() => {/* Profile will be refetched automatically */}} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden flex flex-col">
      {/* User Profile in top right */}
      <div className="absolute top-4 right-4 z-20">
        <UserProfile />
      </div>

      {/* Fun background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl" style={{animationDelay: '0s'}}>⭐</div>
        <div className="absolute top-20 right-20 text-3xl" style={{animationDelay: '1s'}}>🌟</div>
        <div className="absolute bottom-20 left-20 text-5xl" style={{animationDelay: '2s'}}>✨</div>
        <div className="absolute bottom-10 right-10 text-4xl" style={{animationDelay: '3s'}}>🎯</div>
        <div className="absolute top-1/2 left-10 text-3xl" style={{animationDelay: '4s'}}>🚀</div>
        <div className="absolute top-1/3 right-10 text-4xl" style={{animationDelay: '5s'}}>🎉</div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col py-8">
        {/* Quiz Buddy Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src={quizBuddyLogo} 
              alt="Quiz Buddy Logo" 
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-5xl font-bold text-foreground font-fredoka">
              Quiz-Buddy
            </h1>
          </div>
          <div className="inline-block bg-purple-600 p-3 rounded-full shadow-lg">
            <p className="text-lg font-semibold text-white">
              🎓 Welcome to QuizBuddy, {profile?.display_name}! 🌈
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="play" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Play Quiz
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Manage Questions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="play" className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-lg text-muted-foreground">
                  Choose a topic to start your learning adventure!
                </p>
              </div>
              
              <div className="flex items-center justify-center">
                {topicsLoading ? (
                  <TopicsGridSkeleton />
                ) : topics.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-8">
                    {topics.map((topic, index) => (
                      <div 
                        key={topic.id} 
                        className="animate-fade-in"
                        style={{animationDelay: `${index * 0.2}s`}}
                      >
                        <TopicButton
                          emoji={topic.emoji}
                          title={topic.name}
                          onClick={() => handleTopicSelect(topic.id)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Ready to Start Learning!</h3>
                    <p className="text-lg text-muted-foreground mb-4">
                      Let's generate some questions for you to practice with!
                    </p>
                    <Button 
                      onClick={() => setActiveTab('manage')}
                      size="lg"
                      className="animate-pulse"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Generate Questions
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="manage" className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-lg text-muted-foreground">
                  Generate fresh AI-powered questions for each topic
                </p>
              </div>
              
              <QuestionGenerator 
                topics={topics} 
                onQuestionsGenerated={handleQuestionsGenerated}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ChatTab
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </div>
  );
};

export default Index;
