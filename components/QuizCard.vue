<template>
  <div
    @click="play()"
    class="relative rounded-xl cursor-pointer overflow-hidden w-full max-w-xs h-64 sm:h-72 mx-auto bg-white shadow-md border border-gray-100 group transition-all duration-200 hover:shadow-xl hover:scale-105"
  >
    <img v-if="img" class="w-full h-32 sm:h-36 object-cover" :src="img" alt="Quiz Image" />
    <img
      v-else
      class="w-full h-32 sm:h-36 object-cover"
      src="@/assets/img/card_wallp.jpeg"
      alt="Quiz Image"
    />

    <div class="flex flex-col items-center justify-center px-4 py-4 h-32 sm:h-36">
      <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-1 truncate w-full text-center">
        {{ title }}
      </h2>
      <div class="text-xs sm:text-sm text-gray-500 mb-2 truncate w-full text-center">
        {{ duration }} min
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { title, duration, img, quizId } = defineProps<{
  title: string;
  duration: number;
  img: string;
  quizId: number;
}>();

const router = useRouter();

const play = () => {
  router.push(`/quiz/play/${quizId}`);
};
</script>
