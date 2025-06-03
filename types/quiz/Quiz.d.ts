import { Tag } from "../tag/Tag";
import { QuizLevel } from "../level/QuizLevel";
import { Category } from "../category/Category";
import type { Question } from "../question/Question";

export type Quiz = {
  id: number;
  title: string;
  description: string;
  level_id: number;
  category_id: number;
  is_public: boolean;
  status: string;
  duration: number;
  max_attempts: number;
  pass_score: number;
  thumbnail?: string;
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
  questions?: Question[];
};
