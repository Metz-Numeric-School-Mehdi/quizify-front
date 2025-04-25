export type Tag = {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  pivot: {
    quiz_id: number;
    tag_id: number;
  };
};
