import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  SubscriptionPlan,
  UserSubscription,
  CheckoutSession,
  CheckoutSessionPayload,
  SubscriptionPlansResponse,
  UserSubscriptionResponse,
  CheckoutSessionResponse,
  SubscriptionCancellationResponse,
  SubscriptionSyncResponse,
  QuotaCheck,
} from "~/types/subscription/Subscription";

export const subscriptionStore = defineStore(
  "subscription",
  () => {
    const plans = ref<SubscriptionPlan[]>([]);
    const currentSubscription = ref<UserSubscription | null>(null);
    const currentCheckoutSession = ref<CheckoutSession | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const auth = authStore();

    /**
     * Fetch all available subscription plans
     */
    const fetchPlans = async (): Promise<void> => {
      try {
        loading.value = true;
        error.value = null;

        const { data: response, error: fetchError } = await useFetch<SubscriptionPlan[]>("/api/subscription/plans", {
          baseURL: useRuntimeConfig().public.apiBase,
          method: "GET",
        });

        if (fetchError.value) {
          console.warn("Subscription plans endpoint not available yet, using mock data:", fetchError.value);
          error.value = null;
          plans.value = getMockPlans();
          return;
        }

        if (Array.isArray(response.value)) {
          plans.value = response.value;
        } else if (
          response.value &&
          typeof response.value === "object" &&
          "data" in response.value
        ) {
          plans.value = (response.value as any).data;
        } else {
          console.warn("No subscription plans available, using mock data");
          plans.value = getMockPlans();
        }
      } catch (err) {
        console.warn(
          "Subscription plans endpoint not available yet, using mock data:",
          err
        );
        error.value = null;
        plans.value = getMockPlans();
      } finally {
        loading.value = false;
      }
    };

    /**
     * Fetch current user subscription
     */
    const fetchCurrentSubscription = async (): Promise<void> => {
      try {
        loading.value = true;
        error.value = null;

        const { data: response, error: fetchError } = await useFetch<UserSubscription>("/api/subscription/current", {
          baseURL: useRuntimeConfig().public.apiBase,
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.state.token}`,
          },
        });

        if (fetchError.value) {
          console.warn("Subscription current endpoint not available yet, using mock data:", fetchError.value);
          error.value = null;
          currentSubscription.value = getMockCurrentSubscription();
          return;
        }

        if (response.value && typeof response.value === "object") {
          if ("subscription" in response.value || "plan" in response.value) {
            currentSubscription.value = response.value as UserSubscription;
          } else if ("data" in response.value && (response.value as any).data) {
            const data = (response.value as any).data;
            if (data.plan) {
              currentSubscription.value = {
                plan: {
                  ...data.plan,
                  price:
                    typeof data.plan.price === "string"
                      ? parseFloat(data.plan.price)
                      : data.plan.price,
                  currency: data.plan.currency || "EUR",
                },
                subscription: data.subscription,
                usage: data.usage || {
                  quizzes_used: 0,
                  questions_used: 0,
                  participants_this_month: 0,
                },
                next_billing_date: data.next_billing_date || null,
                payment_method: data.payment_method || null,
              };
            } else {
              currentSubscription.value = getMockCurrentSubscription();
            }
          } else {
            currentSubscription.value = getMockCurrentSubscription();
          }
        } else {
          currentSubscription.value = getMockCurrentSubscription();
        }
      } catch (err) {
        console.warn(
          "Subscription endpoint not available yet, using mock data:",
          err
        );
        error.value = null;
        currentSubscription.value = getMockCurrentSubscription();
      } finally {
        loading.value = false;
      }
    };

    /**
     * Get mock subscription plans for development
     */
    const getMockPlans = (): SubscriptionPlan[] => {
      return [
        {
          id: 1,
          name: "Free",
          description: "Plan gratuit avec fonctionnalités de base",
          price: 0.0,
          currency: "EUR",
          billing_period: "month",
          stripe_price_id: null,
          features: {
            max_quizzes: 5,
            max_questions_per_quiz: 10,
            max_participants: 20,
            analytics: false,
            custom_branding: false,
            api_access: false,
          },
          is_active: true,
        },
        {
          id: 2,
          name: "Premium",
          description: "Plan premium pour utilisateurs avancés",
          price: 9.99,
          currency: "EUR",
          billing_period: "month",
          stripe_price_id: "price_premium_monthly",
          features: {
            max_quizzes: 50,
            max_questions_per_quiz: 100,
            max_participants: 500,
            analytics: true,
            custom_branding: false,
            api_access: false,
          },
          is_active: true,
        },
        {
          id: 3,
          name: "Business",
          description: "Plan business pour organisations",
          price: 29.99,
          currency: "EUR",
          billing_period: "month",
          stripe_price_id: "price_business_monthly",
          features: {
            max_quizzes: -1,
            max_questions_per_quiz: -1,
            max_participants: -1,
            analytics: true,
            custom_branding: true,
            api_access: true,
          },
          is_active: true,
        },
      ];
    };

    /**
     * Get mock current subscription for development
     */
    const getMockCurrentSubscription = (): UserSubscription => {
      return {
        subscription: null,
        plan: getMockPlans()[0],
        usage: {
          quizzes_created: 3,
          current_month_participants: 45,
        },
        next_billing_date: null,
        payment_method: null,
      };
    };

    /**
     * Create a checkout session for a specific plan
     */
    const createCheckoutSession = async (
      planType: "premium" | "business"
    ): Promise<CheckoutSession | null> => {
      try {
        loading.value = true;
        error.value = null;

        const auth = authStore();
        const token = auth.state.token;

        const { data: response, error: fetchError } = await useFetch<{
          message: string;
          checkout_url: string;
          session_id: string;
          plan: any;
        }>("/api/checkout", {
          baseURL: useRuntimeConfig().public.apiBase,
          method: "GET",
          query: {
            sub: planType,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (fetchError.value) {
          error.value = "Erreur lors de la création de la session de paiement";
          return null;
        }

        if (response.value && "checkout_url" in response.value && response.value.checkout_url) {
          const checkoutSession: CheckoutSession = {
            checkout_url: response.value.checkout_url,
            session_id: response.value.session_id,
            expires_at: new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ).toISOString(),
          };

          currentCheckoutSession.value = checkoutSession;

          if (typeof window !== "undefined") {
            window.open(response.value.checkout_url, "_blank", "noopener,noreferrer");
          }

          return checkoutSession;
        }

        throw new Error("Invalid checkout session response");
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Unknown error";
        console.error("Error creating checkout session:", err);
        return null;
      } finally {
        loading.value = false;
      }
    };

    /**
     * Cancel current subscription
     */
    const cancelSubscription = async (): Promise<boolean> => {
      try {
        loading.value = true;
        error.value = null;

        const { error: fetchError } = await useFetch<any>("/api/subscription/cancel", {
          baseURL: useRuntimeConfig().public.apiBase,
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.state.token}`,
          },
        });

        if (fetchError.value) {
          error.value = "Erreur lors de l'annulation de l'abonnement";
          return false;
        }

        await fetchCurrentSubscription();
        return true;
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Unknown error";
        console.error("Error canceling subscription:", err);
        return false;
      } finally {
        loading.value = false;
      }
    };

    /**
     * Sync subscription with Stripe
     */
    const syncSubscription = async (): Promise<boolean> => {
      try {
        loading.value = true;
        error.value = null;

        const { error: fetchError } = await useFetch<any>("/api/subscription/sync", {
          baseURL: useRuntimeConfig().public.apiBase,
          method: "POST",
        });

        if (fetchError.value) {
          error.value = "Erreur lors de la synchronisation de l'abonnement";
          return false;
        }

        await fetchCurrentSubscription();
        return true;
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Unknown error";
        console.error("Error syncing subscription:", err);
        return false;
      } finally {
        loading.value = false;
      }
    };

    /**
     * Get plan by ID
     */
    const getPlanById = (id: number): SubscriptionPlan | undefined => {
      return plans.value.find((plan: SubscriptionPlan) => plan.id === id);
    };

    /**
     * Check if user can create a quiz based on current plan
     */
    const canCreateQuiz = (): boolean => {
      if (!currentSubscription.value) return false;

      const { plan, usage } = currentSubscription.value;
      if (plan.features.max_quizzes === -1) return true;

      return usage.quizzes_created < plan.features.max_quizzes;
    };

    /**
     * Get remaining quizzes for current plan
     */
    const getRemainingQuizzes = (): number => {
      if (!currentSubscription.value) return 0;

      const { plan, usage } = currentSubscription.value;
      if (plan.features.max_quizzes === -1) return -1;

      return Math.max(0, plan.features.max_quizzes - usage.quizzes_created);
    };

    /**
     * Check if user has analytics access
     */
    const hasAnalyticsAccess = (): boolean => {
      return currentSubscription.value?.plan.features.analytics || false;
    };

    /**
     * Check if user has API access
     */
    const hasApiAccess = (): boolean => {
      return currentSubscription.value?.plan.features.api_access || false;
    };

    /**
     * Check if user has custom branding access
     */
    const hasCustomBranding = (): boolean => {
      return currentSubscription.value?.plan.features.custom_branding || false;
    };

    /**
     * Get complete quota check
     */
    const getQuotaCheck = (): QuotaCheck => {
      if (!currentSubscription.value) {
        return {
          can_create_quiz: false,
          remaining_quizzes: 0,
          can_add_participants: false,
          max_participants_reached: true,
          analytics_available: false,
          api_access_available: false,
        };
      }

      const { plan, usage } = currentSubscription.value;

      return {
        can_create_quiz: canCreateQuiz(),
        remaining_quizzes: getRemainingQuizzes(),
        can_add_participants:
          plan.features.max_participants === -1 ||
          usage.current_month_participants < plan.features.max_participants,
        max_participants_reached:
          plan.features.max_participants !== -1 &&
          usage.current_month_participants >= plan.features.max_participants,
        analytics_available: hasAnalyticsAccess(),
        api_access_available: hasApiAccess(),
      };
    };

    /**
     * Check if user is on free plan
     */
    const isFreePlan = (): boolean => {
      return currentSubscription.value?.plan.price === 0;
    };

    /**
     * Check if subscription is active
     */
    const isSubscriptionActive = (): boolean => {
      return currentSubscription.value?.subscription?.status === "active";
    };

    /**
     * Check if subscription is canceled but still active
     */
    const isSubscriptionCanceled = (): boolean => {
      return (
        currentSubscription.value?.subscription?.cancel_at_period_end === true
      );
    };

    /**
     * Get formatted price for a plan
     */
    const getFormattedPrice = (plan: SubscriptionPlan): string => {
      if (plan.price === 0) return "Gratuit";

      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: plan.currency.toUpperCase(),
      }).format(plan.price);
    };

    /**
     * Clear store state
     */
    const clearStore = (): void => {
      plans.value = [];
      currentSubscription.value = null;
      currentCheckoutSession.value = null;
      error.value = null;
    };

    return {
      plans,
      currentSubscription,
      currentCheckoutSession,
      loading,
      error,
      fetchPlans,
      fetchCurrentSubscription,
      createCheckoutSession,
      cancelSubscription,
      syncSubscription,
      getPlanById,
      canCreateQuiz,
      getRemainingQuizzes,
      hasAnalyticsAccess,
      hasApiAccess,
      hasCustomBranding,
      getQuotaCheck,
      isFreePlan,
      isSubscriptionActive,
      isSubscriptionCanceled,
      getFormattedPrice,
      clearStore,
    };
  },
  {
    persist: true,
  }
);
