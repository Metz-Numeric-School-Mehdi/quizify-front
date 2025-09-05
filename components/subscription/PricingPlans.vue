<template>
    <div class="space-y-6">
        <div class="text-center space-y-2">
            <h2 class="text-3xl font-bold">Choisissez votre plan</h2>
            <p class="text-muted-foreground">
                Sélectionnez le plan qui correspond le mieux à vos besoins
            </p>
        </div>

        <div v-if="useSubscription.loading" class="flex justify-center py-8">
            <Icon name="loader-2" class="h-8 w-8 animate-spin" />
        </div>

        <div v-else-if="useSubscription.error" class="text-center py-8">
            <p class="text-red-500 mb-4">{{ useSubscription.error }}</p>
            <Button @click="useSubscription.fetchPlans()" variant="outline">
                Réessayer
            </Button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PricingCard v-for="plan in useSubscription.plans" :key="plan.id" :plan="plan"
                @subscribe="handleSubscribe" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import Icon from '@/components/Icon.vue';
import PricingCard from './PricingCard.vue';

const useSubscription = subscriptionStore();

const handleSubscribe = (planType: 'premium' | 'business') => {
    console.log('Plan selected:', planType);
};

onMounted(async () => {
    await Promise.all([
        useSubscription.fetchPlans(),
        useSubscription.fetchCurrentSubscription()
    ]);
});
</script>
