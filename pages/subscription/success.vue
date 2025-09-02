<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div class="mb-6">
        <img 
          src="/quizifyIcon.png" 
          alt="Quizify" 
          class="w-16 h-16 mx-auto mb-4"
        >
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckIconAnimate />
        </div>
      </div>
      
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        Abonnement activé !
      </h1>
      
      <p class="text-gray-600 mb-6">
        Félicitations ! Votre abonnement a été activé avec succès.
      </p>
      
      <div class="space-y-3">
        <NuxtLink 
          to="/" 
          class="w-full bg-gray-100 text-gray-700  py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors inline-block"
        >
          Retour à l'accueil
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import CheckIconAnimate from '~/assets/animation/checkIconAnimate.vue'

definePageMeta({
  layout: false
})

const route = useRoute()
const sessionId = route.query.session_id

onMounted(() => {
  if (sessionId) {
    console.log('Session ID:', sessionId)
  }
})
</script>
