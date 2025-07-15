import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Volume2, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export function QuizQuestion({ question, questionNumber, totalQuestions, onAnswer, onNext }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    onAnswer(correct);

    if (correct) {
      // Trigger confetti for correct answers
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(question.question);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  useEffect(() => {
    resetQuestion();
  }, [question.id]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <h2 className="text-xl font-semibold leading-relaxed flex-1">
              {question.question}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReadAloud}
              className="flex-shrink-0 hover:bg-accent"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 mb-6">
        {question.options.map((option, index) => {
          let buttonVariant: "outline" | "default" | "destructive" = "outline";
          let iconElement = null;
          
          if (showResult) {
            if (index === question.correctAnswer) {
              buttonVariant = "default";
              iconElement = <Check className="h-4 w-4" />;
            } else if (index === selectedAnswer && index !== question.correctAnswer) {
              buttonVariant = "destructive";
              iconElement = <X className="h-4 w-4" />;
            }
          }

          return (
            <Button
              key={index}
              variant={buttonVariant}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={cn(
                "h-auto p-4 text-left justify-start gap-3 transition-all duration-200",
                selectedAnswer === index && !showResult && "ring-2 ring-primary",
                showResult && index === question.correctAnswer && "bg-success hover:bg-success text-success-foreground animate-pulse-glow",
                showResult && index === selectedAnswer && index !== question.correctAnswer && "animate-wiggle"
              )}
            >
              {iconElement}
              <span className="flex-1">{option}</span>
            </Button>
          );
        })}
      </div>

      {showResult && (
        <div className="space-y-4">
          {question.explanation && (
            <Card className="p-4 bg-accent/50">
              <p className="text-sm">{question.explanation}</p>
            </Card>
          )}
          
          <div className="flex justify-center">
            <Button
              onClick={onNext}
              className="px-8 py-2 font-semibold animate-bounce-fun"
            >
              {questionNumber === totalQuestions ? "Finish Quiz" : "Next Question"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}