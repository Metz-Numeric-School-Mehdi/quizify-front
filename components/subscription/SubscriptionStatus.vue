<template>
    <AlertDialog :open="showCancelConfirmation" @update:open="showCancelConfirmation = $event">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Annuler votre abonnement</AlertDialogTitle>
                <AlertDialogDescription>
                    Êtes-vous sûr de vouloir annuler votre abonnement ? Il restera actif jusqu'à la fin de la période de
                    facturation.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel @click="cancelNavigation">Annuler</AlertDialogCancel>
                <AlertDialogAction @click="confirmNavigation">Quitter</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center space-x-2">
                <Icon name="credit-card" class="h-5 w-5" />
                <span>Votre abonnement</span>
            </CardTitle>
        </CardHeader>

        <CardContent class="space-y-4">
            <div v-if="subscription" class="space-y-4">
                <div class="flex justify-between items-center">
                    <span class="font-medium">Plan actuel</span>
                    <Badge :variant="getBadgeVariant(subscription.subscription?.status)">
                        {{ subscription.plan.name }}
                    </Badge>
                </div>

                <div class="flex justify-between items-center">
                    <span>Prix</span>
                    <span class="font-medium">
                        {{ useSubscription.getFormattedPrice(subscription.plan) }}
                        <span v-if="subscription.plan.price > 0" class="text-sm text-muted-foreground">
                            /{{ subscription.plan.billing_period === 'month' ? 'mois' : 'an' }}
                        </span>
                    </span>
                </div>

                <div v-if="subscription.subscription" class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span>Statut</span>
                        <Badge :variant="getBadgeVariant(subscription.subscription.status)">
                            {{ getStatusLabel(subscription.subscription.status) }}
                        </Badge>
                    </div>

                    <div v-if="subscription.next_billing_date" class="flex justify-between items-center">
                        <span>Prochaine facturation</span>
                        <span class="text-sm">{{ formatDate(subscription.next_billing_date) }}</span>
                    </div>

                    <div v-if="subscription.subscription.cancel_at_period_end"
                        class="flex justify-between items-center">
                        <span>Expiration</span>
                        <span class="text-sm text-orange-600">
                            {{ formatDate(subscription.subscription.current_period_end) }}
                        </span>
                    </div>
                </div>

                <Separator />

                <div class="space-y-2">
                    <h4 class="font-medium">Utilisation</h4>

                    <div class="space-y-2">
                        <div class="flex justify-between items-center text-sm">
                            <span>Quiz créés</span>
                            <span>
                                {{ subscription.usage.quizzes_created }}
                                <span v-if="subscription.plan.features.max_quizzes !== -1"
                                    class="text-muted-foreground">
                                    / {{ subscription.plan.features.max_quizzes }}
                                </span>
                            </span>
                        </div>

                        <div v-if="subscription.plan.features.max_quizzes !== -1"
                            class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full"
                                :style="{ width: `${getUsagePercentage(subscription.usage.quizzes_created, subscription.plan.features.max_quizzes)}%` }">
                            </div>
                        </div>

                        <div class="flex justify-between items-center text-sm">
                            <span>Participants ce mois</span>
                            <span>
                                {{ subscription.usage.current_month_participants }}
                                <span v-if="subscription.plan.features.max_participants !== -1"
                                    class="text-muted-foreground">
                                    / {{ subscription.plan.features.max_participants }}
                                </span>
                            </span>
                        </div>

                        <div v-if="subscription.plan.features.max_participants !== -1"
                            class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-green-600 h-2 rounded-full"
                                :style="{ width: `${getUsagePercentage(subscription.usage.current_month_participants, subscription.plan.features.max_participants)}%` }">
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="subscription.payment_method" class="space-y-2">
                    <Separator />
                    <h4 class="font-medium">Moyen de paiement</h4>
                    <div class="flex items-center space-x-2 text-sm">
                        <Icon name="credit-card" class="h-4 w-4" />
                        <span>{{ subscription.payment_method.brand.toUpperCase() }} •••• {{
                            subscription.payment_method.last4 }}</span>
                        <span class="text-muted-foreground">
                            {{ subscription.payment_method.exp_month }}/{{ subscription.payment_method.exp_year }}
                        </span>
                    </div>
                </div>
            </div>
        </CardContent>

        <CardFooter class="space-x-2">
            <Button @click="handleCancel" :disabled="loading" variant="outline" class="flex-1">
                <span v-if="loading" class="flex items-center space-x-2">
                    <Icon name="loader-2" class="h-4 w-4 animate-spin" />
                    <span>Annulation...</span>
                </span>
                <span v-else>Annuler l'abonnement</span>
            </Button>
        </CardFooter>
    </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/Icon.vue';
import type { SubscriptionStatus } from '~/types/subscription/UserSubscription';
import { useToast } from '@/components/ui/toast/use-toast';

const useSubscription = subscriptionStore();
const { toast } = useToast();
const loading = ref(false);
const showCancelConfirmation = ref(false);

const subscription = computed(() => useSubscription.currentSubscription);

const getBadgeVariant = (status?: SubscriptionStatus) => {
    switch (status) {
        case 'active':
            return 'default';
        case 'trialing':
            return 'secondary';
        case 'past_due':
        case 'unpaid':
            return 'destructive';
        case 'canceled':
            return 'outline';
        default:
            return 'outline';
    }
};

const getStatusLabel = (status: SubscriptionStatus): string => {
    const labels = {
        active: 'Actif',
        trialing: 'Période d\'essai',
        past_due: 'Paiement en retard',
        canceled: 'Annulé',
        unpaid: 'Impayé',
        incomplete: 'Incomplet',
        incomplete_expired: 'Expiré'
    };
    return labels[status] || status;
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getUsagePercentage = (used: number, max: number): number => {
    if (max === -1) return 0;
    return Math.min((used / max) * 100, 100);
};

const handleCancel = () => {
    showCancelConfirmation.value = true;
};

const confirmNavigation = async () => {
    showCancelConfirmation.value = false;
    try {
        loading.value = true;
        const success = await useSubscription.cancelSubscription();

        if (success) {
            toast({
                title: 'Abonnement annulé',
                description: 'Votre abonnement a été annulé avec succès'
            });
        }
    } catch (error) {
        toast({
            title: 'Erreur',
            description: 'Impossible d\'annuler l\'abonnement',
            variant: 'destructive'
        });
    } finally {
        loading.value = false;
    }
};

const cancelNavigation = () => {
    showCancelConfirmation.value = false;
};
</script>
