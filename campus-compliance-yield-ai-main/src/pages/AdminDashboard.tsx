import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import ComplaintCard from '@/components/ComplaintCard';
import { useAllComplaints, useComplaintStats } from '@/hooks/useComplaints';
import { FileText, Clock, CheckCircle, Loader2, XCircle, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: complaints, isLoading } = useAllComplaints();
  const { data: stats } = useComplaintStats();

  const recentComplaints = complaints?.slice(0, 5) || [];
  const urgentComplaints = complaints?.filter(
    (c) => c.priority === 'urgent' && c.status === 'pending'
  ) || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of all complaints across the system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Total Complaints"
            value={stats?.total || 0}
            icon={FileText}
          />
          <StatsCard
            title="Pending"
            value={stats?.pending || 0}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="In Progress"
            value={stats?.in_progress || 0}
            icon={Loader2}
            variant="info"
          />
          <StatsCard
            title="Resolved"
            value={stats?.resolved || 0}
            icon={CheckCircle}
            variant="success"
          />
          <StatsCard
            title="Rejected"
            value={stats?.rejected || 0}
            icon={XCircle}
            variant="destructive"
          />
        </div>

        {/* Urgent Complaints */}
        {urgentComplaints.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-destructive flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Urgent Complaints Requiring Attention
            </h2>
            <div className="grid gap-4">
              {urgentComplaints.slice(0, 3).map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  showUser
                  onClick={() => navigate(`/admin/complaints/${complaint.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Complaints */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Complaints</h2>
            <Button variant="ghost" onClick={() => navigate('/admin/complaints')}>
              View all
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : recentComplaints.length > 0 ? (
            <div className="grid gap-4">
              {recentComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  showUser
                  onClick={() => navigate(`/admin/complaints/${complaint.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No complaints yet</h3>
              <p className="text-muted-foreground mt-1">
                Complaints will appear here once students submit them
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
