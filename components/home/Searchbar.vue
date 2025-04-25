<template>
  <div
    class="relative h-14 rounded-xl w-full mt-10 transition-all duration-200 shadow-xl focus-within:ring-2 focus-within:ring-primary-linear focus-within:ring-offset-2">
    <div class="absolute w-full inset-y-0 left-1 flex items-center pl-3">
      <Icon name="Search" :stroke-width="1.75" :size="20" class="text-primary-linear" />
      <Input type="text" placeholder="Rechercher un quiz"
        class="border-none focus-visible:ring-0 text-text-color focus-visible:ring-offset-0 bg-transparent pl-2 w-full" />
    </div>
  </div>

</template>

<script lang="ts" setup>

</script>
