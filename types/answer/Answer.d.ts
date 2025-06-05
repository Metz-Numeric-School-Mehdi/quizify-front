export type Answer = {
  id: number;
  content: string;
  is_correct: boolean;
};

export type CreateAnswer = {
  question_id: number;
  content: string;
  is_correct: string;
};

