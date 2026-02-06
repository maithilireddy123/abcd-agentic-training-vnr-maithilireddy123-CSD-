import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  variant?: 'default' | 'warning' | 'info' | 'success' | 'destructive';
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  variant = 'default',
}: StatsCardProps) {
  const variantStyles = {
    default: 'bg-card',
    warning: 'bg-warning/5 border-warning/20',
    info: 'bg-info/5 border-info/20',
    success: 'bg-success/5 border-success/20',
    destructive: 'bg-destructive/5 border-destructive/20',
  };

  const iconStyles = {
    default: 'text-primary bg-primary/10',
    warning: 'text-warning bg-warning/10',
    info: 'text-info bg-info/10',
    success: 'text-success bg-success/10',
    destructive: 'text-destructive bg-destructive/10',
  };

  return (
    <Card className={cn('border', variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn('p-3 rounded-xl', iconStyles[variant])}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
