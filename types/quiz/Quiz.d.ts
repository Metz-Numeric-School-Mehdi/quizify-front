export interface QuizCategory {
  id: number;
  name: string;
  created_at: string;
}

export interface QuizLevel {
  id: number;
  name: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface Quiz {
  id: number;
  title: string;
  slug: string;
  description: string;
  is_public: number;
  level: QuizLevel;
  user_id: number;
  duration: number | null;
  pass_score: number | null;
  thumbnail: string | null;
  thumbnail_url: string | null;
  tags: any[];
  category: QuizCategory;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface QuizMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
import type { Question } from "../question/Question";
import type { Tag } from "../tag/Tag";
import type { Category } from "./Category";
import type { Level } from "./Level";

export type Quiz = {
  id: number;
  title: string;
  slug: string;
  description: string;
  is_public: boolean | number;
  level: Level;
  user_id: number;
  duration: number;
  pass_score: number;
  thumbnail: string | null;
  thumbnail_url: string | null;
  tags: Tag[];
  category: Category;
  questions: Question[];
  created_at: string;
  updated_at: string;
  status: "draft" | "published" | "archived";
};

export type QuizForm = {
  title: string;
  description: string;
  level_id: number | null;
  category_id: number | null;
  is_public: string | boolean;
  status: "draft" | "published" | "archived";
};
