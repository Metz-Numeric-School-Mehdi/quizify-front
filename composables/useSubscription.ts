import { subscriptionStore } from '#imports';
import { computed } from 'vue';
import type { SubscriptionPlan, SubscriptionFeatures } from '~/types/subscription/SubscriptionPlan';

/**
 * Composable for subscription-related logic and utilities
 */
export const useSubscription = () => {
  const useSubscription = subscriptionStore();

  /**
   * Get current subscription data
   */
  const currentSubscription = computed(() => useSubscription.currentSubscription);

  /**
   * Get current plan
   */
  const currentPlan = computed(() => useSubscription.currentSubscription?.plan);

  /**
   * Check if user is on free plan
   */
  const isFreePlan = computed(() => useSubscription.isFreePlan());

  /**
   * Check if user has an active subscription
   */
  const hasActiveSubscription = computed(() => useSubscription.isSubscriptionActive());

  /**
   * Check if subscription is canceled but still active
   */
  const isSubscriptionCanceled = computed(() => useSubscription.isSubscriptionCanceled());

  /**
   * Get quota information
   */
  const quotaCheck = computed(() => useSubscription.getQuotaCheck());

  /**
   * Check if user can create a quiz
   */
  const canCreateQuiz = computed(() => useSubscription.canCreateQuiz());

  /**
   * Get remaining quizzes count
   */
  const remainingQuizzes = computed(() => useSubscription.getRemainingQuizzes());

  /**
   * Check if user has analytics access
   */
  const hasAnalytics = computed(() => useSubscription.hasAnalyticsAccess());

  /**
   * Check if user has API access
   */
  const hasApiAccess = computed(() => useSubscription.hasApiAccess());

  /**
   * Check if user has custom branding
   */
  const hasCustomBranding = computed(() => useSubscription.hasCustomBranding());

  /**
   * Compare two plans to determine if one is an upgrade
   */
  const isUpgrade = (fromPlan: SubscriptionPlan, toPlan: SubscriptionPlan): boolean => {
    if (fromPlan.price === 0 && toPlan.price > 0) return true;
    return toPlan.price > fromPlan.price;
  };

  /**
   * Compare two plans to determine if one is a downgrade
   */
  const isDowngrade = (fromPlan: SubscriptionPlan, toPlan: SubscriptionPlan): boolean => {
    return toPlan.price < fromPlan.price;
  };

  /**
   * Get feature comparison between plans
   */
  const compareFeatures = (plan1: SubscriptionPlan, plan2: SubscriptionPlan) => {
    const features1 = plan1.features;
    const features2 = plan2.features;

    return {
      quizzes: {
        plan1: features1.max_quizzes,
        plan2: features2.max_quizzes,
        better: features2.max_quizzes === -1 || (features1.max_quizzes !== -1 && features2.max_quizzes > features1.max_quizzes)
      },
      questions: {
        plan1: features1.max_questions_per_quiz,
        plan2: features2.max_questions_per_quiz,
        better: features2.max_questions_per_quiz === -1 || (features1.max_questions_per_quiz !== -1 && features2.max_questions_per_quiz > features1.max_questions_per_quiz)
      },
      participants: {
        plan1: features1.max_participants,
        plan2: features2.max_participants,
        better: features2.max_participants === -1 || (features1.max_participants !== -1 && features2.max_participants > features1.max_participants)
      },
      analytics: {
        plan1: features1.analytics,
        plan2: features2.analytics,
        better: features2.analytics && !features1.analytics
      },
      customBranding: {
        plan1: features1.custom_branding,
        plan2: features2.custom_branding,
        better: features2.custom_branding && !features1.custom_branding
      },
      apiAccess: {
        plan1: features1.api_access,
        plan2: features2.api_access,
        better: features2.api_access && !features1.api_access
      }
    };
  };

  /**
   * Format feature value for display
   */
  const formatFeatureValue = (value: number | boolean, type: 'number' | 'boolean' = 'number'): string => {
    if (type === 'boolean') {
      return value ? 'Inclus' : 'Non inclus';
    }
    
    if (typeof value === 'number') {
      return value === -1 ? 'Illimité' : value.toString();
    }
    
    return value.toString();
  };

  /**
   * Get usage percentage for a feature
   */
  const getUsagePercentage = (used: number, max: number): number => {
    if (max === -1) return 0;
    return Math.min((used / max) * 100, 100);
  };

  /**
   * Get usage status (safe, warning, danger)
   */
  const getUsageStatus = (used: number, max: number): 'safe' | 'warning' | 'danger' => {
    if (max === -1) return 'safe';
    
    const percentage = getUsagePercentage(used, max);
    
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'safe';
  };

  /**
   * Get days until next billing
   */
  const getDaysUntilNextBilling = (): number | null => {
    if (!currentSubscription.value?.next_billing_date) return null;
    
    const nextBilling = new Date(currentSubscription.value.next_billing_date);
    const now = new Date();
    const diffTime = nextBilling.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  /**
   * Get formatted next billing date
   */
  const getFormattedNextBilling = (): string | null => {
    if (!currentSubscription.value?.next_billing_date) return null;
    
    return new Date(currentSubscription.value.next_billing_date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Check if plan has specific feature
   */
  const planHasFeature = (plan: SubscriptionPlan, feature: keyof SubscriptionFeatures): boolean => {
    const featureValue = plan.features[feature];
    
    if (typeof featureValue === 'boolean') {
      return featureValue;
    }
    
    if (typeof featureValue === 'number') {
      return featureValue > 0 || featureValue === -1;
    }
    
    return false;
  };

  /**
   * Get recommended plan based on usage
   */
  const getRecommendedPlan = (): SubscriptionPlan | null => {
    if (!currentSubscription.value || useSubscription.plans.length === 0) return null;
    
    const currentUsage = currentSubscription.value.usage;
    const sortedPlans = [...useSubscription.plans].sort((a, b) => a.price - b.price);
    
    for (const plan of sortedPlans) {
      const features = plan.features;
      
      const canHandleQuizzes = features.max_quizzes === -1 || features.max_quizzes > currentUsage.quizzes_created;
      const canHandleParticipants = features.max_participants === -1 || features.max_participants > currentUsage.current_month_participants;
      
      if (canHandleQuizzes && canHandleParticipants) {
        return plan;
      }
    }
    
    return sortedPlans[sortedPlans.length - 1];
  };

  return {
    currentSubscription,
    currentPlan,
    isFreePlan,
    hasActiveSubscription,
    isSubscriptionCanceled,
    quotaCheck,
    canCreateQuiz,
    remainingQuizzes,
    hasAnalytics,
    hasApiAccess,
    hasCustomBranding,
    isUpgrade,
    isDowngrade,
    compareFeatures,
    formatFeatureValue,
    getUsagePercentage,
    getUsageStatus,
    getDaysUntilNextBilling,
    getFormattedNextBilling,
    planHasFeature,
    getRecommendedPlan
  };
};
