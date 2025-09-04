import type { SubscriptionPlan } from './SubscriptionPlan';

/**
 * Stripe subscription status types
 */
export type SubscriptionStatus = 
  | 'trialing' 
  | 'active' 
  | 'past_due' 
  | 'canceled' 
  | 'unpaid' 
  | 'incomplete' 
  | 'incomplete_expired';

/**
 * Stripe subscription details
 */
export interface StripeSubscription {
  id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  created: string;
}

/**
 * User's payment method information
 */
export interface PaymentMethod {
  type: string;
  last4: string;
  brand: string;
  exp_month: number;
  exp_year: number;
}

/**
 * User's subscription usage statistics
 */
export interface SubscriptionUsage {
  quizzes_created: number;
  current_month_participants: number;
}

/**
 * Complete user subscription information
 */
export interface UserSubscription {
  subscription: StripeSubscription | null;
  plan: SubscriptionPlan;
  usage: SubscriptionUsage;
  next_billing_date: string | null;
  payment_method: PaymentMethod | null;
}

/**
 * API response for current subscription
 */
export interface UserSubscriptionResponse {
  success: boolean;
  data: UserSubscription;
  message?: string;
}

/**
 * Subscription cancellation response
 */
export interface SubscriptionCancellationResponse {
  success: boolean;
  data: {
    subscription: StripeSubscription;
    cancellation_effective_date: string;
  };
  message: string;
}

/**
 * Subscription synchronization response
 */
export interface SubscriptionSyncResponse {
  success: boolean;
  data: {
    synchronized: boolean;
    subscription_updated: boolean;
    plan_changed: boolean;
    last_sync: string;
  };
  message: string;
}
