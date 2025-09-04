import { authStore } from "~/stores/authStore";

export interface StripeCheckoutOptions {
  planType: "premium" | "business";
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useStripeCheckout = () => {
  const useSubscription = subscriptionStore();
  const auth = authStore();

  /**
   * Initiate Stripe checkout process
   */
  const initiateCheckout = async ({
    planType,
    onSuccess,
    onError,
  }: StripeCheckoutOptions) => {
    // Check if user is authenticated
    if (!auth.state.isAuthenticated || !auth.state.token) {
      const error = "Vous devez être connecté pour souscrire à un abonnement";
      onError?.(error);
      throw new Error(error);
    }

    try {
      const checkoutSession = await useSubscription.createCheckoutSession(
        planType
      );

      if (checkoutSession) {
        onSuccess?.();
        return checkoutSession;
      } else {
        throw new Error("Échec de la création de la session de paiement");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      onError?.(errorMessage);
      throw error;
    }
  };

  /**
   * Check if checkout is available for the user
   */
  const isCheckoutAvailable = computed(() => {
    return auth.state.isAuthenticated && auth.state.token;
  });

  /**
   * Get current subscription status
   */
  const currentSubscription = computed(() => {
    return useSubscription.currentSubscription;
  });

  /**
   * Check if user has active subscription
   */
  const hasActiveSubscription = computed(() => {
    const current = useSubscription.currentSubscription;
    return current && current.status === "active";
  });

  /**
   * Check if user can upgrade to a specific plan
   */
  const canUpgradeTo = (planType: "premium" | "business") => {
    const current = useSubscription.currentSubscription;

    if (!current || current.status !== "active") {
      return true; // Can subscribe to any plan if no active subscription
    }

    // Can upgrade from premium to business
    if (current.plan?.name === "premium" && planType === "business") {
      return true;
    }

    // Cannot downgrade or subscribe to same plan
    return false;
  };

  return {
    initiateCheckout,
    isCheckoutAvailable,
    currentSubscription,
    hasActiveSubscription,
    canUpgradeTo,
    loading: computed(() => useSubscription.loading),
    error: computed(() => useSubscription.error),
  };
};
