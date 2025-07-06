import type { Tag } from "../tag/Tag";
import type { Level } from "./Level";
import type { Category } from "./Category";
import type { Question } from "../question/Question";

export type Quiz = {
  id: number;
  title: string;
  slug: string;
  description: string;
  is_public: boolean;
  level: Level;
  user_id: number;
  duration: number;
  pass_score: number;
  thumbnail: string | null;
  thumbnail_url: string | null;
  tags: Tag[];
  category: Category;
  questions?: Question[];
  created_at?: string;
  updated_at?: string;
};

export type QuizForm = {
  title: string;
  description: string;
  level_id: number | null;
  category_id: number | null;
  is_public: string;
  status: "draft" | "published" | "archived";
};
