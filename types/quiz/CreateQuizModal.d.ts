export type CreateQuizModal = {
  title: string;
  description: string;
  level_id: string;
  category_id: string;
  is_public: boolean;
  status: string;
  duration: number;
  max_attempts: number;
  pass_score: number;
  thumbnail: globalThis.File | null;
  questions: {
    content: string;
    question_type_id: string;
    answers: {
      content: string;
      is_correct: boolean;
    }[];
  }[];
};
