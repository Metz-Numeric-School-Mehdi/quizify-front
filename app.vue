<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster />
</template>

<script lang="ts" setup>
import Toaster from '@/components/ui/toast/Toaster.vue'
// const useAuth = authStore()

// onMounted(() => {
//   useAuth.getData()
// })
</script>