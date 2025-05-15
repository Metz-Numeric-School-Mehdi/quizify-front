<template>
  <div
    class="relative rounded-xl cursor-pointer overflow-hidden w-full max-w-xs h-64 sm:h-72 mx-auto bg-white shadow-md border border-gray-100 group transition-all duration-200 hover:shadow-xl hover:scale-105">
    <img class="w-full h-32 sm:h-36 object-cover" src="@/assets/img/card_wallp.jpeg" alt="Quiz Image" />
    <div class="flex flex-col items-center justify-center px-4 py-4 h-32 sm:h-36">
      <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-1 truncate w-full text-center">
        {{ title }}
      </h2>
      <div class="text-xs sm:text-sm text-gray-500 mb-2 truncate w-full text-center">
        {{ duration }} min
      </div>
      <button
        class="mt-2 px-4 py-2 bg-pink-500 text-white rounded-full font-semibold shadow transition hover:bg-pink-600">
        Jouer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string, duration: number }>()
</script>
