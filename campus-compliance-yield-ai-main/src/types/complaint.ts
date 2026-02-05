export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';
export type ComplaintCategory = 'academic' | 'infrastructure' | 'administrative' | 'hostel' | 'library' | 'other';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Complaint {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: string;
  assigned_to: string | null;
  admin_notes: string | null;
  resolution: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface ComplaintWithProfile extends Complaint {
  profiles?: {
    full_name: string;
    student_id: string | null;
    department: string | null;
    email: string;
  };
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  student_id: string | null;
  department: string | null;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  academic: 'Academic Issues',
  infrastructure: 'Infrastructure',
  administrative: 'Administrative',
  hostel: 'Hostel',
  library: 'Library',
  other: 'Other',
};

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};
