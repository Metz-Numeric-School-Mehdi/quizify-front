/**
 * Stripe checkout session data
 */
export interface CheckoutSession {
  checkout_url: string;
  session_id: string;
  expires_at: string;
}

/**
 * Checkout session creation payload
 */
export interface CheckoutSessionPayload {
  plan_id: number;
}

/**
 * API response for checkout session creation
 */
export interface CheckoutSessionResponse {
  success: boolean;
  data: CheckoutSession;
  message: string;
}

/**
 * Subscription error codes from API
 */
export type SubscriptionErrorCode = 
  | 'PLAN_NOT_FOUND'
  | 'FREE_PLAN_CHECKOUT'
  | 'ALREADY_SUBSCRIBED'
  | 'NO_ACTIVE_SUBSCRIPTION'
  | 'STRIPE_ERROR'
  | 'PAYMENT_FAILED'
  | 'SUBSCRIPTION_SYNC_FAILED';

/**
 * Subscription API error response
 */
export interface SubscriptionErrorResponse {
  success: false;
  message: string;
  error_code: SubscriptionErrorCode;
}

/**
 * Quota check for subscription limitations
 */
export interface QuotaCheck {
  can_create_quiz: boolean;
  remaining_quizzes: number;
  can_add_participants: boolean;
  max_participants_reached: boolean;
  analytics_available: boolean;
  api_access_available: boolean;
}
