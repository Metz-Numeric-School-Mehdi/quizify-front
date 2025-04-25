<template>
  <div class="relative rounded-xl cursor-pointer overflow-hidden w-80 h-80 transform transition-transform group">
    <div class="absolute inset-0 group-hover:scale-105 transition-transform duration-300">
      <img class="w-full h-full opacity-70 group-hover:opacity-100 object-cover" src="@/assets/img/card_wallp.jpeg"
        alt="Quiz Image" />
    </div>
    <div
      class="absolute bottom-0 left-0 right-0 z-10 p-6 text-center bg-white bg-opacity-30 backdrop-blur-lg rounded-xl m-4">
      <h2 class="text-2xl font-bold text-white drop-shadow-lg">{{ quizTitle }}</h2>
      <div
        class="mt-4 inline-block bg-gradient-to-r from-pink-500 to-yellow-500 text-white py-1 px-3 rounded-full text-sm shadow-lg">
        {{ quizTime }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const quizTitle = ref("Nom du Quiz");
const quizTime = ref("15 min");
</script>
