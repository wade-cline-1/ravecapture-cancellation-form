import { supabase } from './supabase'

// Export Supabase client for database operations
export { supabase }

// Helper functions for JSON handling
export const serializeCancellationReasons = (reasons: string[]): string => {
  return JSON.stringify(reasons)
}

export const deserializeCancellationReasons = (reasons: string): string[] => {
  try {
    return JSON.parse(reasons)
  } catch {
    return []
  }
}

// Reason mapping for canonical taxonomy
const REASON_MAP = new Map<string, string>([
  ['found better alternative', 'Not Seeing Enough Value'],
  ['no longer needed', 'Only Needed Temporarily'],
  ['other', 'Something Else'],
])

// Map production reason to canonical taxonomy (case-insensitive)
export const toCanonical = (reason: string): string => {
  return REASON_MAP.get(reason.trim().toLowerCase()) ?? reason
}

// Map array of reasons to canonical taxonomy
export const mapReasonsToCanonical = (reasons: string[]): string[] => {
  return reasons.map(toCanonical)
}
