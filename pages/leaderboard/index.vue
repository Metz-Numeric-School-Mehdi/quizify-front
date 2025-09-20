<template>
  <LeaderboardDisplay />
</template>

<script setup lang="ts">
import LeaderboardDisplay from '~/components/leaderboard/LeaderboardDisplay.vue';

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: 'Classement - Quizify',
  description: 'Consultez le classement des meilleurs joueurs de Quizify. Découvrez qui maîtrise le mieux les quiz et grimpez dans le leaderboard !',
  ogTitle: 'Classement - Quizify',
  ogDescription: 'Consultez le classement des meilleurs joueurs de Quizify.',
  ogImage: '/quizifyIcon.png',
  keywords: 'classement, leaderboard, scores, quiz, competition'
});
</script>
