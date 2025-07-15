import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Star, RotateCcw, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
  onHome: () => void;
  topic: string;
}

export function QuizResults({ score, totalQuestions, onRetry, onHome, topic }: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  useEffect(() => {
    // Celebration confetti for completing the quiz
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2
        }
      });
      
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2
        }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const getEncouragementMessage = () => {
    if (percentage === 100) {
      return "Perfect! You're a superstar! 🌟";
    } else if (percentage >= 80) {
      return "Excellent work! You're doing great! 🎉";
    } else if (percentage >= 60) {
      return "Good job! Keep practicing! 👍";
    } else {
      return "Nice try! Let's practice more! 💪";
    }
  };

  const getStars = () => {
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    return 1;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Trophy className="h-24 w-24 text-celebration animate-bounce-fun" />
            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {score}
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
        <p className="text-lg text-muted-foreground mb-4">
          You completed the {topic} quiz
        </p>
        
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Star
              key={i}
              className={`h-8 w-8 ${
                i < getStars() 
                  ? 'text-celebration fill-celebration' 
                  : 'text-muted-foreground'
              }`}
            />
          ))}
        </div>
        
        <p className="text-xl font-semibold text-primary mb-2">
          {getEncouragementMessage()}
        </p>
      </div>

      <Card className="p-6 mb-8 bg-gradient-to-br from-accent/50 to-primary/10">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-3xl font-bold text-primary mb-1">
              {score}/{totalQuestions}
            </div>
            <p className="text-sm text-muted-foreground">Correct Answers</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-success mb-1">
              {percentage}%
            </div>
            <p className="text-sm text-muted-foreground">Score</p>
          </div>
        </div>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button
          onClick={onHome}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Choose New Topic
        </Button>
      </div>
    </div>
  );
}