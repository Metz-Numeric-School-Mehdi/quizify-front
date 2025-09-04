import type { SubscriptionPlan } from "../subscription/Subscription";

type UserStatistics = {
  quizzes_created_count: number;
  quizzes_played_count: number;
  total_points: number;
};

type UserSubscription = {
  subscription_plan_id: number | null;
  subscription_plan: SubscriptionPlan | null;
  stripe_id: string | null;
  trial_ends_at: string | null;
};

export type User = {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  organization_id: number | null;
  pm_last_four: string | null;
  pm_type: string | null;
  profile_photo: string;
  ranking: number | null;
  role_id: number;
  statistics: UserStatistics;
  subscription: UserSubscription;
  team_id: number | null;
};

export default User;
