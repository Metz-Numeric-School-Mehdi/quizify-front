<template>
  <div class="flex flex-col gap-4 relative">
    <div
      class="bg-white/70 dark:bg-background/90 backdrop-blur-sm py-4 px-4 sm:px-6 rounded-xl shadow-sm border border-border/20 mb-2 z-10">
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-primary-linear mb-1">Explorez les Quiz</h1>
          <p class="text-sm text-text-color/80">Découvrez et testez vos connaissances avec nos quiz interactifs</p>
        </div>

        <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div class="flex-grow order-1 sm:order-none">
            <SimpleSearch @search-result="handleSearchResult" />
          </div>

          <div class="flex gap-2 ml-auto sm:ml-0 order-2 sm:order-none">
            <!-- <Button variant="outline" size="sm" class="flex-shrink-0 whitespace-nowrap" @click="toggleShowFilters()">
              <Icon :name="showFilters ? 'X' : 'Filter'" :size="16" class="mr-1" />
              {{ showFilters ? 'Fermer les filtres' : 'Filtrer' }}
            </Button> -->
          </div>
        </div>
      </div>

      <div v-if="showFilters" class="mt-4 bg-white/60 dark:bg-card/60 p-4 rounded-xl border border-border/30">
        <SimpleFilters @search-result="handleSearchResult" />
      </div>

      <div class="flex flex-wrap items-center gap-2 mt-4">
        <button @click="showAll = !showAll" class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          :class="showAll ? 'bg-primary-linear text-white' : 'bg-white dark:bg-card text-text-color border border-border/30 hover:bg-primary-linear/10'">
          <span class="flex items-center gap-1.5">
            <Icon name="LayoutGrid" :size="16" />
            Tous les quiz
          </span>
        </button>
        <button @click="showAll = false" class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          :class="!showAll ? 'bg-primary-linear text-white' : 'bg-white dark:bg-card text-text-color border border-border/30 hover:bg-primary-linear/10'">
          <span class="flex items-center gap-1.5">
            <Icon name="FolderOpen" :size="16" />
            Par catégorie
          </span>
        </button>
      </div>
    </div>
    <div class="flex justify-end mb-4 z-10">
      <DefaultButton v-if="useAuth.state.isAuthenticated" :ctaButton="true" @click="useQuiz.state.openModal = true"
        class="flex-shrink-0">
        <span class="text-lg sm:text-xl">
          <Icon name="Plus" :stroke-width="2.5" :size="20" />
        </span>
        <span class="hidden sm:inline">Créer un quiz</span>
        <span class="inline sm:hidden">Créer</span>
      </DefaultButton>
    </div>
    <CreateQuizModalAdvanced @close="useQuiz.state.openModal = false" />

    <div v-if="loading" class="w-full min-h-[60vh] flex justify-center items-center">
      <div
        class="bg-white/70 dark:bg-background/90 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-border/20 flex flex-col items-center">
        <div class="w-16 h-16 border-4 border-primary-linear border-t-transparent rounded-full animate-spin mb-6"></div>
        <p class="text-center text-lg font-medium text-primary-linear mb-2">Chargement des quiz</p>
        <p class="text-sm text-text-color/70">Merci de patienter un instant...</p>
      </div>
    </div>

    <div v-else-if="error" class="w-full min-h-[60vh] flex justify-center items-center p-4">
      <div
        class="bg-white/70 dark:bg-background/90 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-red-300/50 max-w-md w-full">
        <div class="flex flex-col items-center text-center">
          <div class="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <Icon name="AlertCircle" :size="32" class="text-red-500" />
          </div>
          <h3 class="text-lg font-semibold text-red-600 mb-2">Une erreur est survenue</h3>
          <p class="text-sm text-text-color/80 mb-6">{{ error }}</p>
          <button @click="search"
            class="flex items-center gap-2 bg-primary-linear hover:bg-primary-linear/90 text-white font-medium py-2 px-6 rounded-full transition-colors">
            <Icon name="RefreshCw" :size="16" />
            Réessayer
          </button>
        </div>
      </div>
    </div>
    <main v-else class="flex-1 flex flex-col gap-6 sm:gap-10 p-0 sm:p-2">
      <template v-if="showAll">
        <section
          class="bg-white/70 dark:bg-background/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-sm border border-border/20">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-xl sm:text-2xl font-bold text-primary-linear">
              <span class="inline-flex items-center gap-2">
                <Icon name="Layout" :size="20" class="text-primary-linear/80" />
                Tous les quiz
              </span>
            </h2>
            <div class="text-sm text-text-color/70">{{ items?.length || 0 }} quiz disponibles</div>
          </div>

          <div v-if="!items?.length" class="flex flex-col items-center justify-center py-16 text-center">
            <div class="w-20 h-20 bg-primary-linear/10 rounded-full flex items-center justify-center mb-4">
              <Icon name="Search" :size="32" class="text-primary-linear/60" />
            </div>
            <h3 class="text-lg font-semibold text-text-color mb-2">Aucun quiz trouvé</h3>
            <p class="text-sm text-text-color/70 max-w-md">Essayez de modifier vos critères de recherche ou créez votre
              propre quiz !</p>
          </div>

          <div v-else
            class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            <QuizCard v-for="quiz in items" :key="quiz.id" :img="quiz.thumbnail_url || ''" :quizId="quiz.id"
              :title="quiz.title" :duration="quiz.duration" :description="quiz.description"
              class="w-full max-w-full sm:max-w-xs h-full" />
          </div>
        </section>
      </template>

      <template v-else>
        <template v-if="Object.keys(quizzesByCategory).length === 0">
          <div
            class="bg-white/70 dark:bg-background/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-sm border border-border/20 flex flex-col items-center justify-center py-16 text-center">
            <div class="w-20 h-20 bg-primary-linear/10 rounded-full flex items-center justify-center mb-4">
              <Icon name="FolderOpen" :size="32" class="text-primary-linear/60" />
            </div>
            <h3 class="text-lg font-semibold text-text-color mb-2">Aucune catégorie trouvée</h3>
            <p class="text-sm text-text-color/70 max-w-md">Essayez de modifier vos critères de recherche ou créez votre
              propre quiz !</p>
          </div>
        </template>

        <template v-else v-for="(quizzes, category) in quizzesByCategory" :key="category">
          <section
            class="bg-white/70 dark:bg-background/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-sm border border-border/20">
            <div class="flex items-center justify-between mb-5">
              <h2 class="text-xl sm:text-2xl font-bold text-primary-linear">
                <span class="inline-flex items-center gap-2">
                  <Icon name="FolderOpen" :size="20" class="text-primary-linear/80" />
                  {{ category }}
                </span>
              </h2>
              <div class="text-sm text-text-color/70">{{ quizzes.length }} quiz</div>
            </div>

            <div
              class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
              <QuizCard v-for="quiz in quizzes" :key="quiz.id" :img="quiz.thumbnail_url || ''" :quizId="quiz.id"
                :title="quiz.title" :duration="quiz.duration" :description="quiz.description" :level="quiz.level"
                class="w-full max-w-full sm:max-w-xs h-full" />
            </div>
          </section>
        </template>
      </template>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useQuizStore } from "~/stores/quizStore";
import { useQuizSearch } from "~/composables/useQuizzesSearch";
import QuizCard from "../QuizCard.vue";
import CreateQuizModalAdvanced from "../modals/quiz/CreateQuizModalAdvanced.vue";
import DefaultButton from "../interaction/buttons/DefaultButton.vue";
import SimpleSearch from "../quiz/search/SimpleSearch.vue";
import SimpleFilters from "../quiz/search/SimpleFilters.vue";
import { Button } from "../ui/button";

const useQuiz = useQuizStore();
const useAuth = authStore();

const { items, meta, loading, error, search } = useQuizSearch();
const showFilters = ref(false);

const showAll = ref(false);

onMounted(() => {
  showAll.value = false;
  search();
});

const toggleShowFilters = () => {
  showFilters.value = !showFilters.value;
};

const handleSearchResult = (results: any) => {
  if (results.items) {
    items.value = results.items;
  }

  if (results.meta) {
    meta.value = results.meta;
  }

  showAll.value = true;
};

const quizzesByCategory = computed(() => {
  const quizzes = items.value;
  const grouped: Record<string, any[]> = {};

  for (const quiz of quizzes || []) {
    const cat = quiz.category?.name || "Autre";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(quiz);
  }

  return Object.keys(grouped)
    .sort()
    .reduce((acc, key) => {
      acc[key] = grouped[key];
      return acc;
    }, {} as Record<string, any[]>);
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
