import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Complaint, ComplaintWithProfile, CATEGORY_LABELS, STATUS_LABELS } from '@/types/complaint';
import { Clock, Tag, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const CATEGORY_LABELS_MAP: Record<string, string> = {
  academic: 'Academic Issues',
  infrastructure: 'Infrastructure',
  administrative: 'Administrative',
  hostel: 'Hostel',
  library: 'Library',
  other: 'Other',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  in_progress: <Loader2 className="w-3 h-3" />,
  resolved: <CheckCircle className="w-3 h-3" />,
  rejected: <XCircle className="w-3 h-3" />,
};

interface ComplaintCardProps {
  complaint: Complaint | ComplaintWithProfile;
  onClick?: () => void;
  showUser?: boolean;
}

export default function ComplaintCard({ complaint, onClick, showUser = false }: ComplaintCardProps) {
  const statusClass = {
    pending: 'status-pending',
    in_progress: 'status-in-progress',
    resolved: 'status-resolved',
    rejected: 'status-rejected',
  }[complaint.status];

  const priorityClass = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-info/10 text-info',
    high: 'bg-warning/10 text-warning',
    urgent: 'bg-destructive/10 text-destructive',
  }[complaint.priority || 'medium'];

  const profile = 'profiles' in complaint ? complaint.profiles : null;

  return (
    <Card
      className={cn(
        'card-hover cursor-pointer border-l-4',
        complaint.status === 'pending' && 'border-l-warning',
        complaint.status === 'in_progress' && 'border-l-info',
        complaint.status === 'resolved' && 'border-l-success',
        complaint.status === 'rejected' && 'border-l-destructive'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {complaint.title}
            </CardTitle>
            {showUser && profile && (
              <p className="text-sm text-muted-foreground mt-1">
                by {profile.full_name} {profile.student_id && `(${profile.student_id})`}
              </p>
            )}
          </div>
          <Badge className={cn('shrink-0 flex items-center gap-1', statusClass)}>
            {STATUS_ICONS[complaint.status]}
            {complaint.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {complaint.description}
        </p>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {CATEGORY_LABELS_MAP[complaint.category]}
            </Badge>
            <Badge className={priorityClass}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              {complaint.priority || 'Medium'}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
