import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TopicButtonProps {
  emoji: string;
  title: string;
  onClick: () => void;
  className?: string;
}

export function TopicButton({ emoji, title, onClick, className }: TopicButtonProps) {
  // Random fun colors for each topic
  const colors = [
    'bg-coral hover:bg-coral/90 text-coral-foreground border-coral/20',
    'bg-sky-blue hover:bg-sky-blue/90 text-sky-blue-foreground border-sky-blue/20',
    'bg-mint-green hover:bg-mint-green/90 text-mint-green-foreground border-mint-green/20'
  ];
  
  // Use title to consistently assign same color to same topic
  const colorIndex = title.length % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Circle with emoji */}
      <button
        onClick={onClick}
        className={cn(
          'group relative w-32 h-32 rounded-full border-4 transition-all duration-300',
          'hover:scale-110 hover:shadow-2xl active:scale-95',
          'hover:rotate-12 transform-gpu',
          colorClass,
          className
        )}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-7xl transform group-hover:scale-110 transition-transform duration-300">
            {emoji}
          </div>
        </div>
        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
      
      {/* Title outside */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
      </div>
    </div>
  );
}