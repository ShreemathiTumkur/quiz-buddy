import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Volume2, Check, X, Mic, MicOff } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  text: string;
  question_type: string;
  options: string[] | null;
  correct_answer: string;
  fun_fact: string;
}

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export function QuizQuestion({ question, questionNumber, totalQuestions, onAnswer, onNext }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim();
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

  const handleSubmitFillBlank = () => {
    if (selectedAnswer.trim() && !showResult) {
      handleAnswerSelect(selectedAnswer);
    }
  };

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(question.text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer("");
    setShowResult(false);
    setIsCorrect(false);
  };

  useEffect(() => {
    resetQuestion();
  }, [question.id]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioForSpeech(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      setIsRecording(true);
      mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioForSpeech = async (audioBlob: Blob) => {
    setIsProcessingAudio(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onload = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        if (!base64Audio) throw new Error('Failed to convert audio');

        // Call the speech-to-text edge function
        const { data, error } = await supabase.functions.invoke('speech-to-text', {
          body: { 
            audio: base64Audio,
            language: 'te' // Telugu language code
          }
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data?.text) {
          setSelectedAnswer(data.text);
          handleAnswerSelect(data.text);
        } else {
          toast({
            title: "No Speech Detected",
            description: "Please try speaking again more clearly.",
            variant: "destructive",
          });
        }
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Speech Recognition Failed",
        description: "Could not understand the audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAudio(false);
    }
  };

  const getQuestionTypeDisplay = () => {
    switch (question.question_type) {
      case 'multiple_choice': return 'Multiple Choice';
      case 'true_false': return 'True/False';
      case 'fill_blank': return 'Fill in the Blank';
      case 'yes_no': return 'Yes/No';
      case 'voice_input': return 'Voice Answer';
      default: return 'Question';
    }
  };

  const renderQuestionContent = () => {
    switch (question.question_type) {
      case 'multiple_choice':
        return (
          <div className="grid gap-3 mb-6">
            {question.options?.map((option, index) => {
              let buttonVariant: "outline" | "default" | "destructive" = "outline";
              let iconElement = null;
              
              if (showResult) {
                if (option === question.correct_answer) {
                  buttonVariant = "default";
                  iconElement = <Check className="h-4 w-4" />;
                } else if (option === selectedAnswer && option !== question.correct_answer) {
                  buttonVariant = "destructive";
                  iconElement = <X className="h-4 w-4" />;
                }
              }

              return (
                <Button
                  key={index}
                  variant={buttonVariant}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={cn(
                    "h-auto p-4 text-left justify-start gap-3 transition-all duration-200",
                    selectedAnswer === option && !showResult && "ring-2 ring-primary",
                    showResult && option === question.correct_answer && "bg-success hover:bg-success text-success-foreground animate-pulse-glow",
                    showResult && option === selectedAnswer && option !== question.correct_answer && "animate-wiggle"
                  )}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                  {iconElement}
                  <span className="flex-1">{option}</span>
                </Button>
              );
            })}
          </div>
        );

      case 'true_false':
      case 'yes_no':
        return (
          <div className="grid gap-3 mb-6">
            {question.options?.map((option, index) => {
              let buttonVariant: "outline" | "default" | "destructive" = "outline";
              let iconElement = null;
              
              if (showResult) {
                if (option === question.correct_answer) {
                  buttonVariant = "default";
                  iconElement = <Check className="h-4 w-4" />;
                } else if (option === selectedAnswer && option !== question.correct_answer) {
                  buttonVariant = "destructive";
                  iconElement = <X className="h-4 w-4" />;
                }
              }

              return (
                <Button
                  key={index}
                  variant={buttonVariant}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={cn(
                    "h-auto p-4 text-left justify-start gap-3 transition-all duration-200",
                    selectedAnswer === option && !showResult && "ring-2 ring-primary",
                    showResult && option === question.correct_answer && "bg-success hover:bg-success text-success-foreground animate-pulse-glow",
                    showResult && option === selectedAnswer && option !== question.correct_answer && "animate-wiggle"
                  )}
                >
                  {iconElement}
                  <span className="flex-1">{option}</span>
                </Button>
              );
            })}
          </div>
        );

      case 'fill_blank':
        return (
          <div className="space-y-4 mb-6">
            <div className="flex gap-2">
              <Input
                placeholder="Type your answer here..."
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={showResult}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitFillBlank()}
              />
              <Button 
                onClick={handleSubmitFillBlank}
                disabled={!selectedAnswer.trim() || showResult}
              >
                Submit
              </Button>
            </div>
            {showResult && (
              <Card className="p-4 bg-accent/50">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Correct answer: </span>
                    {question.correct_answer}
                  </p>
                </div>
              </Card>
            )}
          </div>
        );

      case 'voice_input':
        return (
          <div className="space-y-4 mb-6">
            <div className="text-center">
              <p className="text-lg text-muted-foreground mb-4">
                🎤 Click and hold to record your Telugu answer
              </p>
              <div className="flex flex-col items-center gap-4">
                <Button
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  disabled={showResult || isProcessingAudio}
                  className={cn(
                    "w-24 h-24 rounded-full text-white font-bold transition-all duration-200",
                    isRecording && "animate-pulse scale-110"
                  )}
                >
                  {isProcessingAudio ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                  ) : isRecording ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {isProcessingAudio 
                    ? "Processing your answer..." 
                    : isRecording 
                    ? "Recording... Release to stop" 
                    : "Press and hold to record"}
                </p>
              </div>
              
              {selectedAnswer && (
                <div className="mt-4 p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Your answer:</p>
                  <p className="text-lg font-medium">{selectedAnswer}</p>
                </div>
              )}
            </div>
            
            {showResult && (
              <Card className="p-4 bg-accent/50">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Correct answer: </span>
                    {question.correct_answer}
                  </p>
                </div>
              </Card>
            )}
          </div>
        );

      default:
        return <p>Unknown question type</p>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{getQuestionTypeDisplay()}</Badge>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <h2 className="text-xl font-semibold leading-relaxed flex-1">
              {question.text}
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

      {renderQuestionContent()}

      {showResult && (
        <div className="space-y-4">
          {question.fun_fact && (
            <Card className="p-4 bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-2">
                <div className="text-blue-600 text-lg">💡</div>
                <div>
                  <p className="font-medium text-blue-900 mb-1">Fun Fact!</p>
                  <p className="text-blue-800">{question.fun_fact}</p>
                </div>
              </div>
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