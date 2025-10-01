import { supabase } from './supabase';

export type EducationEventType = 'shown' | 'cta_clicked' | 'link_clicked';
export type EducationCTAType = 'schedule_call' | 'connect_email' | 'continue_canceling' | 'show_feature' | 'talk_support';

export async function logEducationEvent(
  flowId: string,
  stepType: string,
  action: EducationEventType,
  ctaType?: EducationCTAType,
  linkUrl?: string
) {
  try {
    const { error } = await supabase
      .from('cancellation_education_events')
      .insert([{
        flow_id: flowId,
        step_type: stepType,
        action,
        cta_type: ctaType,
        link_url: linkUrl
      }]);

    if (error) {
      console.error('Failed to log education event:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error logging education event:', error);
    // Don't throw here - we don't want to break the UI flow if logging fails
  }
}