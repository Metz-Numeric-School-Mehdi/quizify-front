export type Answer = {
  id: number;
  content: string;
  is_correct: boolean;
  order_position?: number;
  created_at?: string;
  updated_at?: string;
};

export type CreateAnswer = {
  question_id: number;
  content: string;
  is_correct: boolean;
  order_position?: number;
};

export type CreateBulkAnswers = {
  question_id: number;
  answers: Array<{
    content: string;
    is_correct: boolean;
    order_position?: number;
  }>;
};

export type updateAnswer = {
  id: number;
  question_id: number;
  content: string;
  is_correct: boolean;
  order_position?: number;
}
