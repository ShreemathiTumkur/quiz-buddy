import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TopicButtonProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: 'coral' | 'sky-blue' | 'mint-green';
  onClick: () => void;
  className?: string;
}

export function TopicButton({ icon, title, description, color, onClick, className }: TopicButtonProps) {
  const colorClasses = {
    coral: 'bg-coral hover:bg-coral/90 text-coral-foreground border-coral/20',
    'sky-blue': 'bg-sky-blue hover:bg-sky-blue/90 text-sky-blue-foreground border-sky-blue/20',
    'mint-green': 'bg-mint-green hover:bg-mint-green/90 text-mint-green-foreground border-mint-green/20'
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Circle with emoji only */}
      <button
        onClick={onClick}
        className={cn(
          'group relative w-32 h-32 rounded-full border-4 transition-all duration-300',
          'hover:scale-110 hover:shadow-2xl active:scale-95',
          'hover:rotate-12 transform-gpu',
          colorClasses[color],
          className
        )}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-7xl transform group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
      
      {/* Title and description outside */}
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-sm font-semibold text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}