<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center space-y-4 mb-8">
        <h1 class="text-4xl font-bold text-primary">Rechercher des Quiz</h1>
        <p class="text-lg text-muted-foreground">
          Découvrez des quiz par catégorie, niveau ou mots-clés
        </p>
      </div>
      
      <div class="space-y-6">
        <SimpleSearch @search-result="handleSearchResult" />
        <SimpleFilters @search-result="handleSearchResult" />
        
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-2 text-muted-foreground">Recherche en cours...</p>
        </div>
        
        <div v-else-if="searchResults?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuizCard 
            v-for="quiz in searchResults" 
            :key="quiz.id"
            :img="quiz.thumbnail_url || ''"
            :quizId="quiz.id"
            :title="quiz.title"
            :duration="quiz.duration"
            :description="quiz.description"
            :level="quiz.level"
          />
        </div>
        
        <div v-else-if="hasSearched" class="text-center py-12">
          <Icon name="Search" class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-xl font-semibold mb-2">Aucun quiz trouvé</h3>
          <p class="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QuizCard from '~/components/QuizCard.vue'
import SimpleSearch from '~/components/quiz/search/SimpleSearch.vue'
import SimpleFilters from '~/components/quiz/search/SimpleFilters.vue'

const searchResults = ref([])
const loading = ref(false)
const hasSearched = ref(false)

const handleSearchResult = (results: any) => {
  searchResults.value = results.items || []
  hasSearched.value = true
  loading.value = false
}

useSeoMeta({
  title: 'Rechercher des Quiz - Quizify',
  description: 'Recherchez parmi des milliers de quiz sur Quizify. Filtrez par catégorie, niveau de difficulté et trouvez le quiz parfait pour tester vos connaissances.',
  ogTitle: 'Rechercher des Quiz - Quizify',
  ogDescription: 'Recherchez et filtrez des quiz par catégorie et niveau sur Quizify.',
  ogImage: '/quizifyIcon.png',
  keywords: 'recherche quiz, filtres, catégories, niveaux, connaissances'
})
</script>
