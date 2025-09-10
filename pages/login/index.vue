<template>
  <div class="flex min-h-screen w-full items-center justify-center px-4 py-8">
    <LoginForm />
  </div>
</template>

<script lang="ts" setup>
import LoginForm from "~/components/auth/LoginForm.vue";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: 'Connexion - Quizify',
  description: 'Connectez-vous à votre compte Quizify pour accéder à vos quiz personnalisés, suivre vos performances et rejoindre la communauté.',
  ogTitle: 'Connexion - Quizify',
  ogDescription: 'Connectez-vous à votre compte Quizify pour accéder à vos quiz et performances.',
  robots: 'noindex, nofollow'
});
</script>
