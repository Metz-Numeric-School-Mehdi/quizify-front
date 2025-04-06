<template>
  <div class="flex flex-wrap p-10">
    <div
      class="w-80 cursor-pointer relative group h-80 shadow-lg bg-white rounded-lg overflow-hidden"
    >
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
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "default",
});
</script>
