<template>
  <div class="flex flex-col gap-4 relative">
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <div class="absolute w-32 h-32 bg-pink-200 opacity-30 rounded-full top-10 left-10 animate-pulse"></div>
      <div class="absolute w-24 h-24 bg-blue-200 opacity-20 rounded-full bottom-20 right-20 animate-ping"></div>
      <div class="absolute w-16 h-16 bg-yellow-200 opacity-20 rounded-full top-1/2 left-1/2 animate-bounce"></div>
      <div class="absolute w-20 h-20 bg-purple-200 opacity-10 rounded-full bottom-10 left-1/3 animate-spin-slow"></div>
    </div>
    <div class="flex justify-end mb-4 z-10">
      <button @click="useQuiz.state.openModal = true"
        class="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-bounce-slow text-base sm:text-lg">
        <span class="text-xl sm:text-2xl">
          <Icon name="Plus" :stroke-width="2.5" :size="20" />
        </span>
        <span class="hidden sm:inline">Créer un quiz</span>
        <span class="inline sm:hidden">Créer</span>
      </button>
    </div>
    <CreateQuizModal @close="useQuiz.state.openModal = false" />
    <div v-if="!useQuiz.state.ready && !useQuiz.state.quizzes" class="w-full h-screen flex justify-center items-center">
      <p class="text-center text-2xl">Loading...</p>
    </div>
    <main v-else class="flex-1 flex flex-col gap-10 p-2 sm:p-6">
      <template v-for="(quizzes, category) in quizzesByCategory" :key="category">
        <div>
          <h2 class="text-lg sm:text-xl font-bold text-pink-600 mb-2 ml-2">{{ category }}</h2>
          <div class="relative">
            <div class="flex gap-4 sm:gap-6 overflow-x-auto pb-4 hide-scrollbar pr-8 justify-start">
              <QuizCard v-for="quiz in quizzes" :key="quiz.id" :img="quiz.thumbnail_url || ''" :title="quiz.title"
                :duration="quiz.duration" class="min-w-[260px] max-w-xs flex-shrink-0" />
            </div>
            <div class="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white/90 to-transparent" />
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, nextTick } from 'vue'
import { useQuizStore } from '~/stores/quizStore'
import QuizCard from '../QuizCard.vue';
import CreateQuizModal from '../modals/quiz/CreateQuizModal.vue';

const useQuiz = useQuizStore();

const quizzesList = computed(() => {
  const q = useQuiz.state.quizzes as any
  if (!q) return []
  if (Array.isArray(q)) return q
  if (q.data && Array.isArray(q.data)) return q.data
  return []
})

const quizzesByCategory = computed(() => {
  const quizzes = quizzesList.value
  const grouped: Record<string, any[]> = {}
  for (const quiz of quizzes) {
    const cat = quiz.category?.name || 'Autre'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(quiz)
  }
  return grouped
})

onMounted(async () => {
  await nextTick()
  useQuiz.getAll();
});
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
