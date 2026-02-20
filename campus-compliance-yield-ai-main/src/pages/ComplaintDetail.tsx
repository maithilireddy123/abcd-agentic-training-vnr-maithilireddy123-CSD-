import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useComplaint, useDeleteComplaint } from '@/hooks/useComplaints';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Clock,
  Tag,
  AlertTriangle,
  User,
  Calendar,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  MessageSquare,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const CATEGORY_LABELS: Record<string, string> = {
  academic: 'Academic Issues',
  infrastructure: 'Infrastructure',
  administrative: 'Administrative',
  hostel: 'Hostel',
  library: 'Library',
  other: 'Other',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4" />,
  in_progress: <Loader2 className="w-4 h-4" />,
  resolved: <CheckCircle className="w-4 h-4" />,
  rejected: <XCircle className="w-4 h-4" />,
};

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { data: complaint, isLoading, error } = useComplaint(id || '');
  const deleteComplaint = useDeleteComplaint();

  const handleDelete = async () => {
    if (id) {
      await deleteComplaint.mutateAsync(id);
      navigate('/complaints');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !complaint) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Complaint not found</h2>
          <p className="text-muted-foreground mt-2">
            The complaint you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const statusClass = {
    pending: 'status-pending',
    in_progress: 'status-in-progress',
    resolved: 'status-resolved',
    rejected: 'status-rejected',
  }[complaint.status];

  const canDelete = complaint.status === 'pending' && !isAdmin;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl">{complaint.title}</CardTitle>
                <CardDescription className="mt-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Submitted on {format(new Date(complaint.created_at), 'PPP')}
                </CardDescription>
              </div>
              <Badge className={cn('flex items-center gap-1 text-sm', statusClass)}>
                {STATUS_ICONS[complaint.status]}
                {complaint.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Meta info */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {CATEGORY_LABELS[complaint.category]}
              </Badge>
              <Badge
                className={cn(
                  complaint.priority === 'low' && 'bg-muted text-muted-foreground',
                  complaint.priority === 'medium' && 'bg-info/10 text-info',
                  complaint.priority === 'high' && 'bg-warning/10 text-warning',
                  complaint.priority === 'urgent' && 'bg-destructive/10 text-destructive'
                )}
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                {complaint.priority || 'Medium'} Priority
              </Badge>
              {complaint.profiles && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {complaint.profiles.full_name}
                </Badge>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {/* Admin Notes */}
            {complaint.admin_notes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Admin Notes
                  </h3>
                  <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">
                    {complaint.admin_notes}
                  </p>
                </div>
              </>
            )}

            {/* Resolution */}
            {complaint.resolution && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-success">
                    <CheckCircle className="w-4 h-4" />
                    Resolution
                  </h3>
                  <p className="text-muted-foreground bg-success/5 border border-success/20 p-4 rounded-lg">
                    {complaint.resolution}
                  </p>
                  {complaint.resolved_at && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Resolved on {format(new Date(complaint.resolved_at), 'PPP')}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Actions */}
            {canDelete && (
              <>
                <Separator />
                <div className="flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Complaint
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Complaint</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this complaint? This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
