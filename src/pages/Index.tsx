import { useState } from 'react';
import { TopicButton } from '@/components/TopicButton';
import { QuizQuestion } from '@/components/QuizQuestion';
import { QuizResults } from '@/components/QuizResults';
import { ChatTab } from '@/components/ChatTab';
import { quizTopics, QuizTopic } from '@/data/quizData';
import { Target } from 'lucide-react';

type AppState = 'home' | 'quiz' | 'results';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('home');
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleTopicSelect = (topic: QuizTopic) => {
    setSelectedTopic(topic);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAppState('quiz');
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedTopic) return;
    
    if (currentQuestionIndex < selectedTopic.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setAppState('results');
    }
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAppState('quiz');
  };

  const handleBackToHome = () => {
    setAppState('home');
    setSelectedTopic(null);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  if (appState === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="h-12 w-12 text-primary animate-pulse-glow" />
              <h1 className="text-4xl font-bold text-foreground">
                Kids Quiz App
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Choose a topic to start learning!
            </p>
          </div>

          {/* Topic Buttons */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {quizTopics.map((topic, index) => (
              <TopicButton
                key={topic.id}
                icon={<span className="text-4xl">{topic.emoji}</span>}
                title={topic.title}
                description={topic.description}
                color={topic.color}
                onClick={() => handleTopicSelect(topic)}
                className="hover:animate-bounce-fun"
              />
            ))}
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-lg text-primary font-medium">
              🎉 Free learning for kids! Have fun exploring! 🎉
            </p>
          </div>
        </div>

        <ChatTab
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
        />
      </div>
    );
  }

  if (appState === 'quiz' && selectedTopic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10">
        <div className="container mx-auto px-4 py-8">
          <QuizQuestion
            question={selectedTopic.questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={selectedTopic.questions.length}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
          />
        </div>

        <ChatTab
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          currentTopic={selectedTopic.title}
        />
      </div>
    );
  }

  if (appState === 'results' && selectedTopic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10">
        <div className="container mx-auto px-4 py-8">
          <QuizResults
            score={score}
            totalQuestions={selectedTopic.questions.length}
            onRetry={handleRetryQuiz}
            onHome={handleBackToHome}
            topic={selectedTopic.title}
          />
        </div>

        <ChatTab
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          currentTopic={selectedTopic.title}
        />
      </div>
    );
  }

  return null;
};

export default Index;
