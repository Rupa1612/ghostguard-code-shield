import { cn } from '@/lib/utils';

interface RiskScoreMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const RiskScoreMeter = ({ 
  score, 
  size = 'md', 
  showLabel = true,
  className 
}: RiskScoreMeterProps) => {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { label: 'Critical', color: 'text-critical', bg: 'bg-critical' };
    if (score >= 60) return { label: 'High', color: 'text-warning', bg: 'bg-warning' };
    if (score >= 40) return { label: 'Elevated', color: 'text-warning', bg: 'bg-warning' };
    if (score >= 20) return { label: 'Guarded', color: 'text-success', bg: 'bg-success' };
    return { label: 'Low', color: 'text-success', bg: 'bg-success' };
  };

  const risk = getRiskLevel(score);
  const percentage = Math.min(100, Math.max(0, score));

  const sizeClasses = {
    sm: { container: 'w-24 h-24', stroke: '6', text: 'text-xs', number: 'text-lg' },
    md: { container: 'w-32 h-32', stroke: '8', text: 'text-sm', number: 'text-xl' },
    lg: { container: 'w-40 h-40', stroke: '10', text: 'text-base', number: 'text-2xl' }
  };

  const sizes = sizeClasses[size];
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Circular Progress */}
      <div className={cn("relative", sizes.container)}>
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth={sizes.stroke}
            fill="transparent"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth={sizes.stroke}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn("transition-all duration-1000 ease-out", risk.color)}
            style={{
              animation: 'draw-circle 1.5s ease-out'
            }}
          />
        </svg>
        
        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold tabular-nums", sizes.number, risk.color)}>
            {Math.round(score)}
          </span>
          <span className={cn("text-muted-foreground", sizes.text)}>
            Risk Score
          </span>
        </div>
      </div>

      {/* Risk level label */}
      {showLabel && (
        <div className="text-center">
          <div className={cn("font-medium", sizes.text, risk.color)}>
            {risk.label} Risk
          </div>
          <div className={cn("text-muted-foreground", 
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}>
            Score: {Math.round(score)}/100
          </div>
        </div>
      )}

    </div>
  );
};