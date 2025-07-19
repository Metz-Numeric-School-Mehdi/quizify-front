export interface LeaderboardEntry {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  profile_photo: string | null;
  ranking: number;
  total_score: string;
  quizzes_completed: number;
}