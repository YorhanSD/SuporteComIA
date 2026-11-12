import { supabase } from '@/lib/supabase';
import type {
  CancellationLevel,
  ComplaintAnalysis,
  ComplaintRecord,
  Urgency,
} from '@/types/complaint';

const URGENCIES: Urgency[] = ['baixo', 'medio', 'critico'];
const CANCELLATION_LEVELS: CancellationLevel[] = ['baixo', 'medio', 'alto'];

const isAnalysis = (value: unknown): value is ComplaintAnalysis => {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.category === 'string' &&
    URGENCIES.includes(v.urgency as Urgency) &&
    typeof v.cancellation_risk === 'number' &&
    CANCELLATION_LEVELS.includes(v.cancellation_level as CancellationLevel) &&
    typeof v.suggested_reply === 'string'
  );
};

export async function analyzeComplaint(complaint: string): Promise<ComplaintAnalysis> {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-complaint`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ complaint }),
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'error' in payload && typeof payload.error === 'string'
        ? payload.error
        : `Falha na análise (${response.status}).`;
    throw new Error(message);
  }

  if (!isAnalysis(payload)) {
    throw new Error('A resposta da análise veio em um formato inesperado.');
  }

  return payload;
}

export async function saveComplaint(complaintText: string, analysis: ComplaintAnalysis): Promise<ComplaintRecord> {
  const { data, error } = await supabase
    .from('support_complaints')
    .insert({
      complaint_text: complaintText,
      category: analysis.category,
      urgency: analysis.urgency,
      cancellation_risk: analysis.cancellation_risk,
      cancellation_level: analysis.cancellation_level,
      suggested_reply: analysis.suggested_reply,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ComplaintRecord;
}

export async function fetchRecentComplaints(limit = 20): Promise<ComplaintRecord[]> {
  const { data, error } = await supabase
    .from('support_complaints')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as ComplaintRecord[];
}
