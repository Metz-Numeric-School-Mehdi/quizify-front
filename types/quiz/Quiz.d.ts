import { Tag } from "../tag/Tag";

export type Quiz = {
  id: number;
  title: string;
  slug: string;
  description: string;
  is_public: number;
  level_id: number;
  status: string;
  user_id: number;
  duration: number;
  max_attempts: number;
  pass_score: number;
  thumbnail: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  tags: Tag[];
  level: QuizLevel;
};
