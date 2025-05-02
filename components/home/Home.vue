<template>
  <div class="flex flex-col gap-4">
    <div v-if="!useQuiz.state.ready && !useQuiz.state.allQuiz" class="w-full h-screen flex justify-center items-center">
      <p class="text-center text-2xl">Loading...</p>
    </div>
    <main v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-white rounded-xl shadow-xl">
      <div v-for="quiz in useQuiz.state.allQuiz" :key="quiz.id"
        class="bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <img :src="quiz.thumbnail || 'https://via.placeholder.com/300'" alt="Quiz Image"
          class="w-full h-40 object-cover" />
        <div class="p-4 flex flex-col gap-3">
          <h3 class="text-lg font-semibold text-gray-800 truncate">{{ quiz.title }}</h3>
          <p class="text-sm text-gray-600 mt-2 truncate">{{ quiz.description }}</p>
          <Button class="rounded-default">Commencer le quiz</Button>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { quizStore } from '~/stores/quizStore';

const useQuiz = quizStore()

onMounted(async () => {
  await nextTick()
  useQuiz.fetch();
});
</script>
