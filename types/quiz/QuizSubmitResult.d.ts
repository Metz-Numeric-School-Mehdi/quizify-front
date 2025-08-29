export type QuizSubmitResult = {
  score: number;
  total: number;
  percentage: number;
  points: {
    base_points: number;
    level_multiplier: number;
    level_points: number;
    performance_bonus: number;
    speed_bonus: number;
    total_points: number;
    breakdown: {
      correct_answers: number;
      total_questions: number;
      success_rate: number;
      quiz_level: number;
      time_spent: number;
      quiz_duration: number;
    };
  };
  quiz_attempt_id: number;
};