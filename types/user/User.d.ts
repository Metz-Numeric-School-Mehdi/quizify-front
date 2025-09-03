import type { SubscriptionPlan } from "../subscription/Subscription";

export type User = {
  id: number;
  username: string;
  firstname?: string;
  lastname?: string;
  email: string;
  role_id?: number;
  profile_photo?: string | null;
  avatar?: string | null;
  ranking?: number | null;
  team_id?: number | null;
  organization_id?: number | null;
  subscription_plan_id?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  stripe_id?: string;
  pm_type?: string;
  pm_last_four?: string;
  trial_ends_at?: string | null;
  subscription_plan?: SubscriptionPlan | null;
};

export default User;
