<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div class="mb-6">
        <NuxtImg src="/quizifyIcon.png" alt="Quizify" class="w-16 h-16 mx-auto mb-4" width="64" height="64" format="webp" />
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckIconAnimate />
        </div>
      </div>

      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        Abonnement activé !
      </h1>

      <p class="text-gray-600 mb-6">
        Félicitations ! Votre abonnement {{ currentPlan?.name }} a été activé avec succès.
      </p>

      <div v-if="currentPlan" class="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 class="font-semibold text-gray-900 mb-2">Votre nouveau plan</h3>
        <div class="space-y-1 text-sm text-gray-600">
          <p>{{ currentPlan.name }} - {{ useSubscription.getFormattedPrice(currentPlan) }}/{{ currentPlan.billing_period
            === 'month' ? 'mois' : 'an' }}</p>
          <p v-if="useSubscription.currentSubscription?.next_billing_date">
            Prochaine facturation : {{ formatDate(useSubscription.currentSubscription.next_billing_date) }}
          </p>
        </div>
      </div>

      <div class="space-y-3">
        <NuxtLink to="/subscription"
          class="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-block">
          Gérer mon abonnement
        </NuxtLink>

        <NuxtLink to="/"
          class="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors inline-block">
          Retour à l'accueil
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import CheckIconAnimate from '~/assets/animation/checkIconAnimate.vue';

definePageMeta({
  layout: false
});

const route = useRoute();
const useSubscription = subscriptionStore();
const sessionId = route.query.session_id;

const currentPlan = computed(() => useSubscription.currentSubscription?.plan);

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(async () => {
  if (sessionId) {
    console.log('Session ID:', sessionId);
    await useSubscription.fetchCurrentSubscription();
  }
});
</script>
