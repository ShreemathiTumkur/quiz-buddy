import { Skeleton } from '@/components/ui/skeleton';

export function TopicSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Circle skeleton */}
      <Skeleton className="w-32 h-32 rounded-full" />
      
      {/* Title and description skeletons */}
      <div className="text-center space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export function TopicsGridSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-12">
      {Array.from({ length: 6 }).map((_, index) => (
        <div 
          key={index}
          className="animate-pulse"
          style={{animationDelay: `${index * 0.1}s`}}
        >
          <TopicSkeleton />
        </div>
      ))}
    </div>
  );
}