import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import ComplaintCard from '@/components/ComplaintCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMyComplaints } from '@/hooks/useComplaints';
import { PlusCircle, Search, Filter, Loader2, FileText } from 'lucide-react';
import type { ComplaintStatus, ComplaintCategory } from '@/types/complaint';

export default function MyComplaints() {
  const navigate = useNavigate();
  const { data: complaints, isLoading } = useMyComplaints();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'all'>('all');

  const filteredComplaints = complaints?.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(search.toLowerCase()) ||
      complaint.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Complaints</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all your submitted complaints
            </p>
          </div>
          <Button onClick={() => navigate('/complaints/new')} className="gradient-primary">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Complaint
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ComplaintStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as ComplaintCategory | 'all')}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="administrative">Administrative</SelectItem>
              <SelectItem value="hostel">Hostel</SelectItem>
              <SelectItem value="library">Library</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Complaints List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredComplaints && filteredComplaints.length > 0 ? (
          <div className="grid gap-4">
            {filteredComplaints.map((complaint) => (
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
            <h3 className="text-lg font-medium">No complaints found</h3>
            <p className="text-muted-foreground mt-1">
              {search || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Submit your first complaint to get started'}
            </p>
            {!search && statusFilter === 'all' && categoryFilter === 'all' && (
              <Button onClick={() => navigate('/complaints/new')} className="mt-4">
                <PlusCircle className="w-4 h-4 mr-2" />
                Submit Complaint
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
