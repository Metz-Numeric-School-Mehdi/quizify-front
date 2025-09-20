export type CreateQuizModal = {
  title: string
  description: string
  level_id: string
  category_id: string
  is_public: string
  status: string
  duration: number
  pass_score: number
  thumbnail: File | null
}
