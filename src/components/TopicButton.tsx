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
    <button
      onClick={onClick}
      className={cn(
        'group relative w-48 h-48 rounded-full border-4 transition-all duration-300',
        'hover:scale-105 hover:shadow-xl active:scale-95',
        'animate-float',
        colorClasses[color],
        className
      )}
    >
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="text-6xl mb-3">
          {icon}
        </div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-center opacity-80 leading-tight">{description}</p>
      </div>
      <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}