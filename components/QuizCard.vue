<template>
  <div
    @click="play()"
    class="relative rounded-xl cursor-pointer overflow-hidden w-full max-w-xs h-64 sm:h-72 mx-auto group bg-transparent transition-all duration-200 hover:bg-gray-200"
  >
    <img v-if="img" class="w-full h-32 sm:h-36 object-cover" :src="img" alt="Quiz Image" />
    <img
      v-else
      class="w-full h-32 p-1 sm:h-36 object-cover rounded-xl"
      src="@/assets/img/card_wallp.jpeg"
      alt="Quiz Image"
    />

    <div class="flex flex-col items-start justify-start px-4 py-4 h-32 sm:h-36">
      <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-1 truncate w-full">
        {{ title }}
      </h2>
      <div class="text-xs sm:text-sm text-primary mb-2 truncate w-full">{{ duration }} min</div>
      <div class="text-xs sm:text-sm text-text-color mb-2 truncate w-full">{{ description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { title, duration, img, quizId } = defineProps<{
  title: string;
  duration: number;
  img: string;
  quizId: number;
  description: string;
}>();

const router = useRouter();

const play = () => {
  router.push(`/quiz/play/${quizId}`);
};
</script>
