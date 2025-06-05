import type { Answer } from "../answer/Answer";

export type Question = {
  id: number;
  content: string;
  question_type_id?: number | null;
  answers: Answer[];
};

export type CreateQuestion = {
  quiz_id: number;
  content: string;
  question_type_id?: number | null;
};
