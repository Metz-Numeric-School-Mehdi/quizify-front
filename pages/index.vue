<template>
  <div class="flex flex-col items-center p-10">
    <h2 class="text-2xl">Jouer</h2>
    <div class="flex flex-wrap justify-center gap-3 p-10">
      <div
        v-for="(_, index) in 6"
        :key="index"
        class="w-80 cursor-pointer relative group h-80 shadow-lg bg-white rounded-xl overflow-hidden"
      >
        <div class="absolute z-10 px-3 m-3 py-2 bg-pink-200 rounded-xl">
          <span>15 min</span>
        </div>
        <div
          class="bg-black absolute w-full h-full group-hover:bg-transparent transition-transform duration-200 ease-in-out opacity-30"
        ></div>
        <img
          src="~/assets/img/card_wallp.jpeg"
          class="h-full w-full object-cover group-hover:scale-110 ease-in-out transition-transform duration-200"
          alt="Arrière plan card"
        />
        <div class="absolute bottom-0 p-4 bg-opacity-50 backdrop-blur-xl w-full rounded-b-lg">
          <span class="text-white block text-center">
            Protecting the Organization against Phishing Attacks
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "default",
});
</script>
