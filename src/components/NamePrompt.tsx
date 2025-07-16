import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NamePromptProps {
  onComplete: () => void;
}

export const NamePrompt = ({ onComplete }: NamePromptProps) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateProfile } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Please enter your child's name",
        description: "We need their name to personalize their Quiz Buddy experience!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await updateProfile({ display_name: name.trim() });
    
    if (error) {
      toast({
        title: "Error saving name",
        description: "Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Welcome to Quiz Buddy!",
        description: `Great to meet you, ${name}! Let's start learning!`,
      });
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      {/* Fun background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{animationDelay: '0s'}}>🌟</div>
        <div className="absolute top-20 right-20 text-3xl animate-bounce" style={{animationDelay: '1s'}}>✨</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce" style={{animationDelay: '2s'}}>🎉</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-bounce" style={{animationDelay: '3s'}}>🚀</div>
      </div>

      <Card className="w-full max-w-md mx-auto z-10 shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Set Up Your Child's Profile! 👶
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            What's your child's name? We'll personalize their Quiz Buddy experience!
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your child's name here..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg py-3 text-center font-medium border-2 focus:border-primary"
                maxLength={50}
                disabled={isLoading}
                autoFocus
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full text-lg py-3 font-semibold"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Setting up profile...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Start Their Learning Journey!
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              You can always update their name later in the profile settings! 😊
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};