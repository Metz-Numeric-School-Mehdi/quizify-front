<template>
    <div class="container mx-auto px-4 py-8 space-y-8">
        <div class="text-center space-y-2">
            <h1 class="text-4xl font-bold">Abonnements</h1>
            <p class="text-muted-foreground">
                Gérez votre abonnement et découvrez nos plans
            </p>
        </div>

        <div v-if="useSubscription.currentSubscription && !useSubscription.isFreePlan()" class="max-w-2xl mx-auto">
            <SubscriptionStatus />
        </div>

        <PricingPlans />
    </div>
</template>

<script setup lang="ts">
import PricingPlans from '~/components/subscription/PricingPlans.vue';
import SubscriptionStatus from '~/components/subscription/SubscriptionStatus.vue';

const useSubscription = subscriptionStore()

useSeoMeta({
  title: 'Abonnements - Quizify',
  description: 'Découvrez nos plans d\'abonnement Quizify. Accédez à des fonctionnalités premium pour créer des quiz illimités et débloquer des options avancées.',
  ogTitle: 'Abonnements - Quizify',
  ogDescription: 'Découvrez nos plans d\'abonnement Quizify Premium.',
  ogImage: '/quizifyIcon.png',
  keywords: 'abonnement, premium, plans, tarifs, quiz illimités'
});
</script>
