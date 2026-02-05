import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface NotificationRequest {
  complaintId: string;
  oldStatus: string;
  newStatus: string;
  userEmail: string;
  complaintTitle: string;
  resolution?: string;
}

const STATUS_MESSAGES: Record<string, string> = {
  pending: "Your complaint is pending review.",
  in_progress: "Your complaint is now being reviewed by our team.",
  resolved: "Great news! Your complaint has been resolved.",
  rejected: "Your complaint has been reviewed and closed.",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { complaintId, oldStatus, newStatus, userEmail, complaintTitle, resolution }: NotificationRequest = await req.json();

    // Validate required fields
    if (!complaintId || !newStatus || !userEmail || !complaintTitle) {
      throw new Error("Missing required fields");
    }

    // Log the notification (in production, this would send an actual email)
    console.log(`📧 Email notification would be sent to: ${userEmail}`);
    console.log(`Complaint: ${complaintTitle} (${complaintId})`);
    console.log(`Status changed from ${oldStatus} to ${newStatus}`);
    
    if (resolution) {
      console.log(`Resolution: ${resolution}`);
    }

    // For now, we'll just log the notification
    // To enable actual email sending, you would:
    // 1. Add a Resend API key via secrets
    // 2. Implement the Resend email sending logic
    
    const notificationData = {
      to: userEmail,
      subject: `Complaint Update: ${complaintTitle}`,
      message: STATUS_MESSAGES[newStatus] || `Your complaint status has been updated to: ${newStatus}`,
      complaintId,
      oldStatus,
      newStatus,
      resolution: resolution || null,
      timestamp: new Date().toISOString(),
    };

    console.log("Notification data:", JSON.stringify(notificationData, null, 2));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification logged successfully",
        notification: notificationData 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-notification function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
