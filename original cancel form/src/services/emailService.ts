import { supabase } from '../lib/supabase';

export type EmailData = {
  reasons: string[];
  feedback: string;
  owner_email: string;
  technical_issue?: string;
  future_plan?: string;
  competitor?: string;
};

export async function sendCancellationConfirmationEmail(data: EmailData) {
  try {
    const { data: response, error } = await supabase.functions.invoke('send-email', {
      body: {
        emailType: 'cancellation_confirmation',
        data: data
      }
    });

    if (error) {
      throw error;
    }

    return response;
  } catch (error) {
    console.error('Failed to send cancellation confirmation email:', error);
    throw error;
  }
}

export async function sendCancellationNotificationEmail(data: EmailData) {
  try {
    const { data: response, error } = await supabase.functions.invoke('send-email', {
      body: {
        emailType: 'cancellation_notification',
        data: data
      }
    });

    if (error) {
      throw error;
    }

    return response;
  } catch (error) {
    console.error('Failed to send cancellation notification email:', error);
    throw error;
  }
}

export async function sendPoorExperienceFollowUpEmail(data: EmailData) {
  try {
    const { data: response, error } = await supabase.functions.invoke('send-email', {
      body: {
        emailType: 'poor_experience_followup',
        data: data
      }
    });

    if (error) {
      throw error;
    }

    return response;
  } catch (error) {
    console.error('Failed to send poor experience follow-up email:', error);
    throw error;
  }
}

export async function sendRetentionConfirmationEmail(userEmail: string) {
  try {
    const { data: response, error } = await supabase.functions.invoke('send-email', {
      body: {
        emailType: 'retention_confirmation',
        data: { owner_email: userEmail }
      }
    });

    if (error) {
      throw error;
    }

    return response;
  } catch (error) {
    console.error('Failed to send retention confirmation email:', error);
    throw error;
  }
}

export async function sendRetentionAcceptanceEmail(data: EmailData) {
  try {
    const { data: response, error } = await supabase.functions.invoke('send-email', {
      body: {
        emailType: 'retention_acceptance',
        data: data
      }
    });

    if (error) {
      throw error;
    }

    return response;
  } catch (error) {
    console.error('Failed to send retention acceptance email:', error);
    throw error;
  }
}

export async function sendOptimizationRequestEmail(data: EmailData) {
  try {
    const { data: response, error } = await supabase.functions.invoke('send-email', {
      body: {
        emailType: 'optimization_request',
        data: data
      }
    });

    if (error) {
      throw error;
    }

    return response;
  } catch (error) {
    console.error('Failed to send optimization request email:', error);
    throw error;
  }
}

export async function sendTechnicalIssueEmails(data: EmailData) {
  try {
    const { data: response, error } = await supabase.functions.invoke('send-email', {
      body: {
        emailType: 'technical_issue',
        data: data
      }
    });

    if (error) {
      throw error;
    }

    return response;
  } catch (error) {
    console.error('Failed to send technical issue emails:', error);
    throw error;
  }
}

export async function sendRetailSyndicationEmail(data: EmailData) {
  try {
    const { data: response, error } = await supabase.functions.invoke('send-email', {
      body: {
        emailType: 'retail_syndication',
        data: data
      }
    });

    if (error) {
      throw error;
    }

    return response;
  } catch (error) {
    console.error('Failed to send retail syndication email:', error);
    throw error;
  }
}