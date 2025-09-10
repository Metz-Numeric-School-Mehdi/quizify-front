<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="text-center space-y-4 mb-8">
        <h1 class="text-4xl font-bold text-primary">Créer un Nouveau Quiz</h1>
        <p class="text-lg text-muted-foreground">
          Partagez vos connaissances en créant un quiz interactif
        </p>
      </div>
      
      <CreateQuizModalAdvanced :open="true" @close="$router.push('/')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CreateQuizModalAdvanced from '~/components/modals/quiz/CreateQuizModalAdvanced.vue'

useSeoMeta({
  title: 'Créer un Quiz - Quizify',
  description: 'Créez votre propre quiz interactif sur Quizify. Ajoutez des questions, personnalisez les réponses et partagez vos connaissances avec la communauté.',
  ogTitle: 'Créer un Quiz - Quizify',
  ogDescription: 'Créez votre propre quiz interactif sur Quizify.',
  ogImage: '/quizifyIcon.png',
  robots: 'noindex, nofollow',
  keywords: 'créer quiz, questions, connaissances, partage'
})
</script>
