import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import type { Complaint, ComplaintCategory, ComplaintStatus, ComplaintWithProfile } from '@/types/complaint';

export function useMyComplaints() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-complaints', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Complaint[];
    },
    enabled: !!user,
  });
}

export function useAllComplaints() {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['all-complaints'],
    queryFn: async () => {
      // First get complaints
      const { data: complaints, error: complaintsError } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (complaintsError) throw complaintsError;

      // Then get profiles for those complaints
      const userIds = [...new Set(complaints.map(c => c.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, student_id, department, email')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Map profiles to complaints
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]));
      const complaintsWithProfiles = complaints.map(c => ({
        ...c,
        profiles: profileMap.get(c.user_id) || null,
      }));

      return complaintsWithProfiles as ComplaintWithProfile[];
    },
    enabled: isAdmin,
  });
}

export function useComplaint(id: string) {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: async () => {
      const { data: complaint, error: complaintError } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .single();

      if (complaintError) throw complaintError;

      // Get profile for this complaint
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, full_name, student_id, department, email')
        .eq('user_id', complaint.user_id)
        .maybeSingle();

      if (profileError) throw profileError;

      return { ...complaint, profiles: profile } as ComplaintWithProfile;
    },
    enabled: !!id,
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (complaint: {
      title: string;
      description: string;
      category: ComplaintCategory;
      priority?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('complaints')
        .insert({
          ...complaint,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-complaints'] });
      toast({
        title: 'Complaint Submitted',
        description: 'Your complaint has been submitted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateComplaint() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<{
        status: ComplaintStatus;
        admin_notes: string;
        resolution: string;
        assigned_to: string;
        priority: string;
        resolved_at: string | null;
      }>;
    }) => {
      // If status is being changed to resolved, set resolved_at
      if (updates.status === 'resolved') {
        updates.resolved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('complaints')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-complaints'] });
      queryClient.invalidateQueries({ queryKey: ['all-complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint'] });
      toast({
        title: 'Complaint Updated',
        description: 'The complaint has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteComplaint() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-complaints'] });
      queryClient.invalidateQueries({ queryKey: ['all-complaints'] });
      toast({
        title: 'Complaint Deleted',
        description: 'The complaint has been deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useComplaintStats() {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['complaint-stats', user?.id, isAdmin],
    queryFn: async () => {
      if (!user) return null;

      let query = supabase.from('complaints').select('status');
      
      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter((c) => c.status === 'pending').length,
        in_progress: data.filter((c) => c.status === 'in_progress').length,
        resolved: data.filter((c) => c.status === 'resolved').length,
        rejected: data.filter((c) => c.status === 'rejected').length,
      };

      return stats;
    },
    enabled: !!user,
  });
}
