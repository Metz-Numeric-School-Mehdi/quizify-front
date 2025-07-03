<template>
  <div class="flex flex-col gap-4 relative">
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <div
        class="absolute w-32 h-32 bg-pink-200 opacity-30 rounded-full top-10 left-10 animate-pulse"
      ></div>
      <div
        class="absolute w-24 h-24 bg-blue-200 opacity-20 rounded-full bottom-20 right-20 animate-ping"
      ></div>
      <div
        class="absolute w-16 h-16 bg-yellow-200 opacity-20 rounded-full top-1/2 left-1/2 animate-bounce"
      ></div>
      <div
        class="absolute w-20 h-20 bg-purple-200 opacity-10 rounded-full bottom-10 left-1/3 animate-spin-slow"
      ></div>
    </div>
    <div class="flex justify-end mb-4 z-10">
      <DefaultButton :ctaButton="true" @click="useQuiz.state.openModal = true">
        <span class="text-xl sm:text-2xl">
          <Icon name="Plus" :stroke-width="2.5" :size="20" />
        </span>
        <span class="hidden sm:inline">Créer un quiz</span>
        <span class="inline sm:hidden">Créer</span>
      </DefaultButton>
    </div>
    <CreateQuizModal @close="useQuiz.state.openModal = false" />
    <div
      v-if="!useQuiz.state.ready && !useQuiz.state.quizzes"
      class="w-full h-screen flex justify-center items-center"
    >
      <p class="text-center text-2xl">Loading...</p>
    </div>
    <main v-else class="flex-1 flex flex-col gap-10 p-2 sm:p-6">
      <template v-for="(quizzes, category) in quizzesByCategory" :key="category">
        <section class="mb-12">
          <h2 class="text-3xl sm:text-[1.7rem] font-bold text-pink-600 mb-4 ml-2 tracking-wide">
            {{ category }}
          </h2>
          <Carousel class="relative w-full" :opts="{ align: 'start' }">
            <CarouselContent class="-ml-1 flex gap-1">
              <CarouselItem
                v-for="quiz in quizzes"
                :key="quiz.id"
                class="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div class="p-5">
                  <QuizCard
                    :img="quiz.thumbnail_url || ''"
                    :quizId="quiz.id"
                    :title="quiz.title"
                    :duration="quiz.duration"
                    :description="quiz.description"
                    class="min-w-[260px] max-w-xs flex-shrink-0 bg-card text-card-foreground rounded-xl"
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      </template>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, nextTick } from "vue";
import { useQuizStore } from "~/stores/quizStore";
import QuizCard from "../QuizCard.vue";
import CreateQuizModal from "../modals/quiz/CreateQuizModal.vue";
import DefaultButton from "../interaction/buttons/DefaultButton.vue";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const useQuiz = useQuizStore();

const quizzesList = computed(() => {
  const q = useQuiz.state.quizzes as any;
  if (!q) return [];
  if (Array.isArray(q)) return q;
  if (q.data && Array.isArray(q.data)) return q.data;
  return [];
});

const quizzesByCategory = computed(() => {
  const quizzes = quizzesList.value;
  const grouped: Record<string, any[]> = {};
  for (const quiz of quizzes) {
    const cat = quiz.category?.name || "Autre";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(quiz);
  }
  return grouped;
});

onMounted(async () => {
  await nextTick();
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
