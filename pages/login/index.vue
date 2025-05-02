<template>
  <div class="flex h-screen w-full items-center justify-center px-4">
    <LoginForm />
  </div>
</template>

<script lang="ts" setup>
import LoginForm from "~/components/auth/LoginForm.vue";

definePageMeta({
  layout: false,
});
</script>
