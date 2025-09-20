export interface QuestionFormAnswer {
  id?: number;
  content: string;
  is_correct: boolean;
  order_position?: number;
}

export interface QuestionForm {
  id?: number;
  content: string;
  question_type_id: number;
  answers: QuestionFormAnswer[];
}

export interface QuizCreationForm {
  quiz: {
    title: string;
    description?: string;
    level_id: number;
    is_public: boolean;
    status: 'draft' | 'published' | 'archived';
    duration?: number;
    max_attempts?: number;
    pass_score?: number;
    thumbnail?: string;
  };
  questions: QuestionForm[];
}

export type QuestionTypeNames = 'Choix multiples' | 'Vrai ou Faux' | 'Choix unique' | 'Remise dans l\'ordre';
