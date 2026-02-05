import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComplaint, useUpdateComplaint, useDeleteComplaint } from '@/hooks/useComplaints';
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
  Save,
  Mail,
  Building,
  IdCard,
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
import type { ComplaintStatus } from '@/types/complaint';

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

export default function AdminComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: complaint, isLoading, error } = useComplaint(id || '');
  const updateComplaint = useUpdateComplaint();
  const deleteComplaint = useDeleteComplaint();

  const [status, setStatus] = useState<ComplaintStatus | ''>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [resolution, setResolution] = useState('');
  const [priority, setPriority] = useState('');

  // Initialize form when complaint loads
  if (complaint && !status) {
    setStatus(complaint.status);
    setAdminNotes(complaint.admin_notes || '');
    setResolution(complaint.resolution || '');
    setPriority(complaint.priority || 'medium');
  }

  const handleSave = async () => {
    if (!id || !status) return;

    await updateComplaint.mutateAsync({
      id,
      updates: {
        status,
        admin_notes: adminNotes || null,
        resolution: resolution || null,
        priority,
      },
    });
  };

  const handleDelete = async () => {
    if (id) {
      await deleteComplaint.mutateAsync(id);
      navigate('/admin/complaints');
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
            The complaint you're looking for doesn't exist.
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Complaints
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {complaint.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Admin Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Admin Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as ComplaintStatus)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Admin Notes (Internal)</Label>
                  <Textarea
                    placeholder="Add internal notes about this complaint..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Resolution (Visible to Student)</Label>
                  <Textarea
                    placeholder="Provide resolution details that will be shown to the student..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    className="flex-1 gradient-primary"
                    disabled={updateComplaint.isPending}
                  >
                    {updateComplaint.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Complaint</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this complaint? This action cannot be undone.
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
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Student Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {complaint.profiles ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {complaint.profiles.full_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{complaint.profiles.full_name}</p>
                        <p className="text-sm text-muted-foreground">Student</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      {complaint.profiles.student_id && (
                        <div className="flex items-center gap-2 text-sm">
                          <IdCard className="w-4 h-4 text-muted-foreground" />
                          <span>{complaint.profiles.student_id}</span>
                        </div>
                      )}
                      {complaint.profiles.department && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span>{complaint.profiles.department}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate">{complaint.profiles.email}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Student information not available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
