export type QuizConfigType = {
  title: string;
  description: string;
  form: {
    title: string;
    vModel: string;
    value?: string;
    options?: string | {
        [key: string]: any;
          id: string;
          name: string;
        }[]
    fetch?: string
    type: 'text' | 'textarea' | 'select' | 'switch' | 'number';
    placeholder: string;
    required: boolean;
  }[];
}

export type QuizCreatePayloadType = {
  [key: string]: any;
  title: string;
  description: string;
  level_id: string | number;
  category_id: string | number;
  is_public: boolean;
  status: string;
  duration: number;
  pass_score: number;
  thumbnail: File | null;
  questions: any[];
}