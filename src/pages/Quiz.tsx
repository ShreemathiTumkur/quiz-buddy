import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Volume2, Home, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface Question {
  id: string;
  text: string;
  fun_fact: string | null;
  options?: string[];
  correct_answer: string;
}

interface Topic {
  id: string;
  name: string;
  emoji: string;
}

const Quiz = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [freeTextAnswer, setFreeTextAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch topic and questions
  useEffect(() => {
    const fetchQuizData = async () => {
      if (!topicId || !user) return;

      try {
        setLoading(true);

        // Fetch topic details
        const { data: topicData, error: topicError } = await supabase
          .from('topics')
          .select('id, name, emoji')
          .eq('id', topicId)
          .single();

        if (topicError) {
          console.error('Error fetching topic:', topicError);
          toast({
            title: "Topic not found",
            description: "The quiz topic you're looking for doesn't exist.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        setTopic(topicData);

        // Fetch 10 random questions for this topic
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('id, text, fun_fact, options, correct_answer')
          .eq('topic_id', topicId)
          .limit(10);

        if (questionsError) {
          console.error('Error fetching questions:', questionsError);
          toast({
            title: "Error loading quiz",
            description: "Unable to load questions. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (!questionsData || questionsData.length === 0) {
          toast({
            title: "No questions available",
            description: "This topic doesn't have any questions yet. Ask your grown-up to add some!",
          });
          navigate('/');
          return;
        }

        // Use actual questions from database
        setQuestions(questionsData as Question[]);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        toast({
          title: "Error",
          description: "Something went wrong loading the quiz.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [topicId, user, navigate, toast]);

  const currentQuestion = questions[currentQuestionIndex];

  const speakQuestion = () => {
    if (!currentQuestion) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentQuestion.text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Speech not supported",
        description: "Your browser doesn't support text-to-speech.",
      });
    }
  };

  const handleSubmit = () => {
    if (!currentQuestion) return;

    const userAnswer = currentQuestion.options ? selectedAnswer : freeTextAnswer.trim();
    const correct = userAnswer.toLowerCase() === currentQuestion.correct_answer.toLowerCase();
    
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setFreeTextAnswer('');
      setShowFeedback(false);
      setIsCorrect(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer('');
    setFreeTextAnswer('');
    setShowFeedback(false);
    setIsCorrect(false);
    setQuizCompleted(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg mx-auto text-center">
          <CardHeader>
            <div className="text-6xl mb-4">{topic?.emoji}</div>
            <CardTitle className="text-3xl font-bold">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-6xl font-bold text-primary">
              {score}/{questions.length}
            </div>
            <p className="text-xl text-muted-foreground">
              {score === questions.length ? "Perfect! You're amazing! 🌟" :
               score >= questions.length * 0.7 ? "Great job! Keep it up! 🎉" :
               "Good try! Practice makes perfect! 💪"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleRetryQuiz} variant="outline" className="flex-1">
                Try Again
              </Button>
              <Button onClick={() => navigate('/')} className="flex-1">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No questions available</h2>
          <Button onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const canSubmit = currentQuestion.options ? selectedAnswer : freeTextAnswer.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-6xl">{topic?.emoji}</div>
            <h1 className="text-4xl font-bold text-foreground font-fredoka">
              {topic?.name}
            </h1>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-lg font-semibold">
              Score: {score}/{questions.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Question Card */}
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                {currentQuestion.text}
              </CardTitle>
              <Button 
                onClick={speakQuestion} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4" />
                🔊 Read aloud
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Answer Options or Free Text */}
            {currentQuestion.options ? (
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedAnswer(option)}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    className="p-4 h-auto text-left justify-start text-lg"
                    disabled={showFeedback}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Type your answer:
                </label>
                <Input
                  value={freeTextAnswer}
                  onChange={(e) => setFreeTextAnswer(e.target.value)}
                  placeholder="Enter your answer here..."
                  className="text-lg py-3"
                  disabled={showFeedback}
                />
              </div>
            )}

            {/* Feedback */}
            {showFeedback && (
              <div className={`p-4 rounded-lg text-center ${
                isCorrect ? 'bg-success/20 border border-success/30' : 'bg-orange-100 border border-orange-300'
              }`}>
                <div className="text-4xl mb-2">
                  {isCorrect ? '🎉' : '💭'}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {isCorrect ? 'Yay! That\'s right!' : 'Nice try!'}
                </h3>
                {!isCorrect && (
                  <p className="text-lg mb-2">
                    The answer is: <strong>{currentQuestion.correct_answer}</strong>
                  </p>
                )}
                {currentQuestion.fun_fact && (
                  <p className="text-sm text-muted-foreground italic">
                    💡 Fun fact: {currentQuestion.fun_fact}
                  </p>
                )}
              </div>
            )}

            {/* Submit/Next Button */}
            {!showFeedback ? (
              <Button 
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full text-lg py-6"
              >
                Submit Answer
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                className="w-full text-lg py-6"
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  'View Results'
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;