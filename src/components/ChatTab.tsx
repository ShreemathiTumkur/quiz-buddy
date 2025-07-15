import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, HelpCircle, Lightbulb, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatTabProps {
  isOpen: boolean;
  onToggle: () => void;
  currentTopic?: string;
}

export function ChatTab({ isOpen, onToggle, currentTopic }: ChatTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Hi there! I'm Quiz Buddy! 🤖 Ask me for hints or help with any question!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickHelp = [
    "Give me a hint! 💡",
    "Explain this topic 📚",
    "I need encouragement! 💪",
    "Tell me something fun! 🎉"
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      text,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (userText: string): string => {
    const text = userText.toLowerCase();
    
    if (text.includes('hint') || text.includes('help')) {
      return "🔍 Here's a tip: Read the question carefully and think about what you know about " + (currentTopic || 'this topic') + ". Eliminate answers that seem obviously wrong first!";
    } else if (text.includes('explain') || text.includes('topic')) {
      return "📖 Great question! " + (currentTopic || 'This topic') + " is really interesting. Take your time to think through each answer. Learning is a journey!";
    } else if (text.includes('encourage') || text.includes('motivation')) {
      return "🌟 You're doing amazing! Every question you answer helps you learn something new. I believe in you! Keep going! 💪";
    } else if (text.includes('fun') || text.includes('joke')) {
      return "🎪 Did you know that when you learn something new, your brain actually grows new connections? That's pretty amazing! You're literally growing your brain right now! 🧠✨";
    } else {
      return "🤔 That's an interesting question! Remember, learning is all about exploring and discovering. If you need specific help with a question, just ask for a hint!";
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {/* Chat Toggle Button */}
      <Button
        onClick={onToggle}
        className={cn(
          "rounded-full w-14 h-14 shadow-lg transition-all duration-300",
          isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
        )}
      >
        {isOpen ? (
          <span className="text-lg">✕</span>
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Chat Panel */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 h-96 p-4 bg-card shadow-2xl border-2">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <HelpCircle className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Quiz Buddy</h3>
              <p className="text-xs text-muted-foreground">Here to help!</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 h-48">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isBot ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-2 rounded-lg text-sm",
                    message.isBot
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Help Buttons */}
          <div className="flex flex-wrap gap-1 mb-3">
            {quickHelp.map((help, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(help)}
                className="text-xs h-6 px-2"
              >
                {help}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask for help..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              className="flex-1 h-8 text-sm"
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}