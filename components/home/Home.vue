<template>
  <div class="min-h-screen flex flex-col items-center bg-background text-foreground">
    <header class="w-full py-6">
      <div class="container mx-auto px-6 text-center">
        <h1 class="text-3xl font-bold text-primary">Bienvenue sur Quizify</h1>
        <p class="mt-2 text-lg text-secondary-foreground">
          Testez vos connaissances avec nos quiz passionnants !
        </p>
      </div>
    </header>

    <div class="container mx-auto px-6 mt-6">
      <input
        type="text"
        placeholder="Rechercher un quiz..."
        class="w-full p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <div class="container mx-auto px-6 mt-10">
      <h2 class="text-2xl font-bold mb-4">Catégories</h2>
      <div class="flex flex-wrap gap-4 justify-center">
        <button
          class="bg-primary text-primary-foreground py-2 px-4 rounded-full shadow-md hover:bg-primary/80"
        >
          Science
        </button>
        <button
          class="bg-primary text-primary-foreground py-2 px-4 rounded-full shadow-md hover:bg-primary/80"
        >
          Histoire
        </button>
        <button
          class="bg-primary text-primary-foreground py-2 px-4 rounded-full shadow-md hover:bg-primary/80"
        >
          Géographie
        </button>
        <button
          class="bg-primary text-primary-foreground py-2 px-4 rounded-full shadow-md hover:bg-primary/80"
        >
          Culture Générale
        </button>
      </div>
    </div>

    <main
      class="container mx-auto px-6 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
    >
      <QuizCard />
      <QuizCard />
      <QuizCard />
    </main>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "default",
});
</script>
