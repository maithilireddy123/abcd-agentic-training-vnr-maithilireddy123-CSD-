import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import DashboardLayout from '@/components/DashboardLayout';
import ComplaintCard from '@/components/ComplaintCard';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { useMyComplaints, useComplaintStats } from '@/hooks/useComplaints';
import { PlusCircle, FileText, Clock, CheckCircle, Loader2, XCircle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: complaints, isLoading } = useMyComplaints();
  const { data: stats } = useComplaintStats();

  const recentComplaints = complaints?.slice(0, 3) || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your complaints
            </p>
          </div>
          <Button onClick={() => navigate('/complaints/new')} className="gradient-primary">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Complaint
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        </div>

        {/* Recent Complaints */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Complaints</h2>
            <Button variant="ghost" onClick={() => navigate('/complaints')}>
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
                  onClick={() => navigate(`/complaints/${complaint.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No complaints yet</h3>
              <p className="text-muted-foreground mt-1">
                Submit your first complaint to get started
              </p>
              <Button onClick={() => navigate('/complaints/new')} className="mt-4">
                <PlusCircle className="w-4 h-4 mr-2" />
                Submit Complaint
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
