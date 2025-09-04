/**
 * Subscription plan interface defining the structure of available subscription plans
 */
export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_period: 'month' | 'year';
  stripe_price_id: string | null;
  features: SubscriptionFeatures;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Features available for each subscription plan
 * -1 values indicate unlimited access
 */
export interface SubscriptionFeatures {
  max_quizzes: number;
  max_questions_per_quiz: number;
  max_participants: number;
  analytics: boolean;
  custom_branding: boolean;
  api_access: boolean;
}

/**
 * API response wrapper for subscription plans
 */
export interface SubscriptionPlansResponse {
  success: boolean;
  data: SubscriptionPlan[];
  message?: string;
}
