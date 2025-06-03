export type Question = {
  id: number;
  quiz_id: number;
  content: string;
  question_type_id: number;
  created_at?: string;
  updated_at?: string;
  answers?: any[];
}
