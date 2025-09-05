<template>
    <Card class="w-full max-w-sm mx-auto">
        <CardHeader class="text-center">
            <CardTitle class="text-2xl font-bold">{{ plan.name }}</CardTitle>
            <CardDescription>{{ plan.description }}</CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
            <div class="text-center">
                <div class="text-3xl font-bold">
                    {{ useSubscription.getFormattedPrice(plan) }}
                    <span v-if="plan.price > 0" class="text-sm text-muted-foreground font-normal">
                        /{{ plan.billing_period === 'month' ? 'mois' : 'an' }}
                    </span>
                </div>
            </div>

            <div class="space-y-3">
                <div class="flex items-center space-x-2">
                    <Icon name="check" class="h-4 w-4 text-green-500" />
                    <span class="text-sm">
                        {{ plan.features.max_quizzes === -1 ? 'Quiz illimités' : `${plan.features.max_quizzes} quiz` }}
                    </span>
                </div>

                <div class="flex items-center space-x-2">
                    <Icon name="check" class="h-4 w-4 text-green-500" />
                    <span class="text-sm">
                        {{ plan.features.max_questions_per_quiz === -1 ? 'Questions illimitées' :
                            `${plan.features.max_questions_per_quiz} questions par quiz` }}
                    </span>
                </div>

                <div class="flex items-center space-x-2">
                    <Icon name="check" class="h-4 w-4 text-green-500" />
                    <span class="text-sm">
                        {{ plan.features.max_participants === -1 ? 'Participants illimités' :
                            `${plan.features.max_participants} participants` }}
                    </span>
                </div>

                <div v-if="plan.features.analytics" class="flex items-center space-x-2">
                    <Icon name="check" class="h-4 w-4 text-green-500" />
                    <span class="text-sm">Analyses avancées</span>
                </div>

                <div v-if="plan.features.custom_branding" class="flex items-center space-x-2">
                    <Icon name="check" class="h-4 w-4 text-green-500" />
                    <span class="text-sm">Personnalisation de marque</span>
                </div>

                <div v-if="plan.features.api_access" class="flex items-center space-x-2">
                    <Icon name="check" class="h-4 w-4 text-green-500" />
                    <span class="text-sm">Accès API</span>
                </div>
            </div>
        </CardContent>

        <CardFooter>
            <Button @click="handleSubscribe" :disabled="loading || isCurrentPlan"
                :variant="isCurrentPlan ? 'outline' : 'default'" class="w-full">
                <span v-if="loading" class="flex items-center space-x-2">
                    <Icon name="loader-2" class="h-4 w-4 animate-spin" />
                    <span>Chargement...</span>
                </span>
                <span v-else-if="isCurrentPlan">Plan actuel</span>
                <span v-else-if="plan.price === 0">Gratuit</span>
                <span v-else>S'abonner</span>
            </Button>
        </CardFooter>
    </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/Icon.vue';
import type { SubscriptionPlan } from '~/types/subscription/SubscriptionPlan';
import { useStripeCheckout } from '~/composables/useStripeCheckout';
import { useToast } from '~/components/ui/toast/use-toast';

interface Props {
    plan: SubscriptionPlan;
    loading?: boolean;
}

interface Emits {
    (e: 'subscribe', planType: 'premium' | 'business'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const useSubscription = subscriptionStore();
const { initiateCheckout, isCheckoutAvailable, canUpgradeTo, loading: checkoutLoading } = useStripeCheckout();
const { toast } = useToast();

const isCurrentPlan = computed(() => {
    return useSubscription.currentSubscription?.plan.id === props.plan.id;
});

const handleSubscribe = async () => {
    if (props.plan.price === 0 || isCurrentPlan.value) {
        return;
    }

    const planType = props.plan.name.toLowerCase() as 'premium' | 'business';

    if (!isCheckoutAvailable.value) {
        toast({
            title: "Connexion requise",
            description: "Vous devez être connecté pour souscrire à un abonnement",
            variant: "destructive",
        });
        return;
    }

    if (!canUpgradeTo(planType)) {
        toast({
            title: "Abonnement non disponible",
            description: "Vous avez déjà souscrit à ce plan ou à un plan supérieur",
            variant: "destructive",
        });
        return;
    }

    if (planType === 'premium' || planType === 'business') {
        try {
            await initiateCheckout({
                planType,
                onSuccess: () => {
                    toast({
                        title: "Redirection vers Stripe",
                        description: "Vous allez être redirigé vers la page de paiement",
                    });
                    emit('subscribe', planType);
                },
                onError: (error) => {
                    toast({
                        title: "Erreur",
                        description: error,
                        variant: "destructive",
                    });
                }
            });
        } catch (error) {
            console.error('Checkout error:', error);
        }
    }
};

const loading = computed(() => props.loading || checkoutLoading.value);
</script>
