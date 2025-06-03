export type Answer = {
  id: number;
  question_id: number;
  content: string;
  is_correct: boolean;
  created_at?: string;
  updated_at?: string;
}
