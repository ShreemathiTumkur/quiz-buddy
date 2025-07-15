import { useState } from 'react';
import { TopicButton } from '@/components/TopicButton';
import { QuizQuestion } from '@/components/QuizQuestion';
import { QuizResults } from '@/components/QuizResults';
import { ChatTab } from '@/components/ChatTab';
import { quizTopics, QuizTopic } from '@/data/quizData';
import { Target } from 'lucide-react';
import quizBuddyLogo from '@/assets/quiz-buddy-logo.png';

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
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        {/* Fun background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-4xl" style={{animationDelay: '0s'}}>⭐</div>
          <div className="absolute top-20 right-20 text-3xl" style={{animationDelay: '1s'}}>🌟</div>
          <div className="absolute bottom-20 left-20 text-5xl" style={{animationDelay: '2s'}}>✨</div>
          <div className="absolute bottom-10 right-10 text-4xl" style={{animationDelay: '3s'}}>🎯</div>
          <div className="absolute top-1/2 left-10 text-3xl" style={{animationDelay: '4s'}}>🚀</div>
          <div className="absolute top-1/3 right-10 text-4xl" style={{animationDelay: '5s'}}>🎉</div>
        </div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <img 
                  src={quizBuddyLogo} 
                  alt="Quiz Buddy Logo" 
                  className="w-20 h-20 object-contain"
                />
                <h1 className="text-7xl font-bold text-foreground">
                  Quiz Buddy
                </h1>
              </div>
              <div className="inline-block bg-purple-600 p-4 rounded-full shadow-lg">
                <p className="text-xl font-semibold text-white">
                  🎓 Choose a topic to start your learning adventure! 🌈
                </p>
              </div>
            </div>
          </div>

          {/* Topic Buttons */}
          <div className="flex flex-wrap justify-center gap-12 mb-12">
            {quizTopics.map((topic, index) => (
              <div 
                key={topic.id} 
                className="animate-fade-in"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <TopicButton
                  icon={topic.emoji}
                  title={topic.title}
                  description={topic.description}
                  color={topic.color}
                  onClick={() => handleTopicSelect(topic)}
                />
              </div>
            ))}
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
