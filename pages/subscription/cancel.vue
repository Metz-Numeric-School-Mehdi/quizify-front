<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div class="mb-6">
        <NuxtImg 
          src="/quizifyIcon.png" 
          alt="Quizify" 
          class="w-16 h-16 mx-auto mb-4"
          width="64"
          height="64"
          format="webp"
        />
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
      </div>
      
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        Abonnement refusé
      </h1>
      
      <p class="text-gray-600 mb-6">
        Votre processus d'abonnement a été annulé. Aucun paiement n'a été effectué.
      </p>
      
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="text-sm text-blue-700">
            <p class="font-medium mb-1">Pas de soucis !</p>
            <p>Vous pouvez continuer à utiliser Quizify avec les fonctionnalités gratuites ou souscrire à un abonnement plus tard.</p>
          </div>
        </div>
      </div>
      
      <div class="space-y-3">
        <NuxtLink 
          to="/subscription"
          class="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-block"
        >
          Voir les plans d'abonnement
        </NuxtLink>
        <NuxtLink 
          to="/" 
          class="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block"
        >
          Retour à l'accueil
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
});
</script>
