export type QuestionResponse = {
  id: number;
  user_id: number;
  quiz_id: number;
  question_id: number;
  answer_id?: number;
  response_text?: string;
  is_correct?: boolean;
  created_at?: string;
  updated_at?: string;
};
