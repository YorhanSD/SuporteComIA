export type Urgency = 'baixo' | 'medio' | 'critico';
export type CancellationLevel = 'baixo' | 'medio' | 'alto';

export interface ComplaintAnalysis {
  category: string;
  urgency: Urgency;
  cancellation_risk: number;
  cancellation_level: CancellationLevel;
  suggested_reply: string;
}

export interface ComplaintRecord extends ComplaintAnalysis {
  id: string;
  complaint_text: string;
  created_at: string;
}
