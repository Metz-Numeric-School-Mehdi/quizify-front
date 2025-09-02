import type { Answer } from "../answer/Answer";
import type { QuestionType } from "../questionType/QuestionType";

export type Question = {
  id: number;
  content: string;
  quiz_id: number;
  question_type_id?: number | null;
  answers: Answer[];
  question_type?: QuestionType;
  created_at?: string;
  updated_at?: string;
};

export type CreateQuestion = {
  quiz_id: number;
  content: string;
  question_type_id?: number | null;
};

export type OrderingQuestion = {
  quiz_id: number;
  content: string;
  answers: Array<{
    content: string;
    order_position: number;
  }>;
};

export type OrderingQuestionResponse = {
  message: string;
  data: {
    question: {
      id: number;
      content: string;
      quiz_id: number;
    };
    answers: Array<{
      id: number;
      content: string;
      order_position: number;
    }>;
  };
};
