<template>
  <Home />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: 'Quizify - Explorez et créez des quiz interactifs',
  description: 'Découvrez des milliers de quiz interactifs, testez vos connaissances et créez vos propres quiz. Rejoignez la communauté Quizify dès maintenant !',
  ogTitle: 'Quizify - Explorez et créez des quiz interactifs',
  ogDescription: 'Découvrez des milliers de quiz interactifs, testez vos connaissances et créez vos propres quiz.',
  ogImage: '/quizifyIcon.png',
  ogUrl: 'https://quizify.local',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Quizify - Quiz interactifs',
  twitterDescription: 'Découvrez et créez des quiz interactifs sur Quizify',
  twitterImage: '/quizifyIcon.png'
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Quizify',
        url: 'https://quizify.local',
        description: 'Plateforme de création et de jeu de quiz interactifs',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://quizify.local/quiz/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      })
    }
  ]
});
</script>
