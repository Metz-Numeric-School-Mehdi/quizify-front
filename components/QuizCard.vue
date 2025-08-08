<template>
  <div
    @click="play()"
    class="relative rounded-xl cursor-pointer overflow-hidden w-full max-w-xs h-[340px] mx-auto group transition-all duration-300 transform hover:translate-y-[-5px]"
  >
    <!-- Card background with glass effect -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm z-0 rounded-xl"></div>
    
    <!-- Card content container with glass morphism -->
    <div class="relative h-full w-full flex flex-col bg-card/80 backdrop-blur-sm rounded-xl border border-border/30 shadow-lg overflow-hidden group-hover:shadow-xl z-10">
      <!-- Image container with overlay gradient -->
      <div class="relative w-full h-40 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        <img 
          v-if="img" 
          class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
          :src="img" 
          alt="Quiz Image" 
          loading="lazy"
        />
        <img 
          v-else 
          class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
          src="@/assets/img/card_wallp.jpeg" 
          alt="Quiz Image" 
          loading="lazy"
        />
        
        <!-- Level badge with glassy effect -->
        <div class="absolute top-3 right-3 z-20">
          <span class="bg-white/80 text-primary-linear text-2xsmall sm:text-xsmall font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md backdrop-blur-sm border border-primary-linear/30 transition-all duration-300 group-hover:bg-primary-linear group-hover:text-white">
            <slot name="level">Niveau</slot>
          </span>
        </div>
      </div>
      
      <!-- Content section with nice spacing -->
      <div class="flex flex-col h-full p-3 sm:p-5 bg-gradient-to-b from-transparent to-card/90">
        <!-- Title with truncate -->
        <h2 class="text-body sm:text-legend font-bold text-primary-linear mb-1 sm:mb-2 truncate w-full">
          {{ title }}
        </h2>
        
        <!-- Duration badge -->
        <div class="flex items-center gap-2 mb-2 sm:mb-3">
          <span class="inline-flex items-center gap-1 bg-secondary/10 text-secondary text-2xsmall sm:text-xsmall font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-secondary/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-3 h-3">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {{ duration ?? '?' }} min
          </span>
        </div>
        
        <!-- Description with line clamp -->
        <div class="text-2xsmall sm:text-small text-text-color/80 line-clamp-3 sm:line-clamp-3 flex-grow">
          {{ description }}
        </div>
        
        <!-- Play indicator that appears on hover - visible on mobile with less opacity -->
        <div class="mt-2 sm:mt-3 sm:opacity-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300 text-primary-linear flex items-center text-2xsmall sm:text-small font-semibold">
          Jouer maintenant
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-3 h-3 sm:w-4 sm:h-4 ml-1">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Glow effect on hover - reduced on mobile -->
    <div class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary-linear/20 to-secondary-linear/20 blur-xl -z-10"></div>
  </div>
</template>

<script setup lang="ts">
const { title, duration, img, quizId, description } = defineProps<{
  title: string;
  duration: number | null;
  img: string;
  quizId: number;
  description: string;
}>();

const router = useRouter();

const play = () => {
  router.push(`/quiz/play/${quizId}`);
};
</script>
