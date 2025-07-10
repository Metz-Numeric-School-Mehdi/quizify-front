<template>
  <header
    class="sticky top-0 z-30 w-full bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 shadow-2lg flex items-center px-4 py-2 gap-4"
  >
    <img
      src="https://img.freepik.com/vecteurs-premium/logo-quiz-symboles-bulle-discours-concept-spectacle-questionnaire-chante-bouton-quiz-concours-questions-icone-neon-illustration-vectorielle-stock_100456-3471.jpg"
      alt="Mascotte Quiz"
      class="w-12 h-12 rounded-full shadow-lg border-4 border-white"
    />
    <NuxtLink to="/" class="font-bold text-lg text-purple-700 drop-shadow text-center mr-4"
      >Quizify</NuxtLink
    >
    <nav class="flex-1 flex items-center gap-2 sm:gap-4 relative">
      <button
        type="button"
        @click="showMobileMenu = !showMobileMenu"
        class="lg:hidden absolute right-0 p-2 rounded hover:bg-pink-200 focus:outline-none"
      >
        <svg
          class="w-7 h-7 text-purple-700"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <ul class="hidden lg:flex flex-1 items-center gap-2 sm:gap-4">
        <li v-for="(link, index) in sidebarItems" :key="index">
          <NuxtLink
            :to="link.path"
            :class="[
              'px-4 py-2 rounded font-semibold rounded-full flex items-center gap-2 transition',
              route.path === link.path
                ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white shadow scale-105'
                : 'text-white hover:text-text-color hover:bg-purple-100 hover:scale-105 hover:shadow-md',
            ]"
          >
            <Icon
              :class="[route.path === link.path ? 'text-white' : 'text-primary-linear']"
              :stroke-width="2"
              :name="link.icon"
            />
            <span>{{ link.name }}</span>
          </NuxtLink>
        </li>
      </ul>
      <div class="hidden lg:flex ml-2 items-center gap-2">
        <template v-if="!useAuth.state.token">
          <DefaultButton :ctaButton="true" @click="router.push('/login')">
            <Icon name="LogIn" :stroke-width="2" />
            Se connecter
          </DefaultButton>
        </template>
        <template v-else>
          <DefaultButton :ctaButton="false" @click="useAuth.signOut()">
            <Icon name="LogOut" :stroke-width="2" />
            Se déconnecter
          </DefaultButton>
        </template>
      </div>
      <transition name="fade">
        <div
          v-if="showMobileMenu"
          class="fixed inset-0 z-40 bg-black/40 flex lg:hidden"
          @click="showMobileMenu = false"
        >
          <div
            class="bg-white w-64 h-full shadow-lg p-6 flex flex-col gap-6 animate-slide-in-left"
            @click.stop
          >
            <button
              type="button"
              @click="showMobileMenu = false"
              class="self-end mb-2 p-2 rounded hover:bg-pink-100"
            >
              <Icon name="X" :stroke-width="2" class="w-6 h-6 text-purple-700" />
            </button>
            <ul class="flex flex-col gap-3">
              <li v-for="(link, index) in sidebarItems" :key="index">
                <NuxtLink
                  @click.native="showMobileMenu = false"
                  :to="link.path"
                  :class="[
                    'px-4 py-2 rounded font-semibold flex items-center gap-2 transition',
                    route.path === link.path
                      ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white shadow scale-105'
                      : 'text-text-color hover:bg-purple-100 hover:scale-105 hover:shadow-md',
                  ]"
                >
                  <Icon
                    :class="[route.path === link.path ? 'text-white' : 'text-primary-linear']"
                    :stroke-width="2"
                    :name="link.icon"
                  />
                  <span>{{ link.name }}</span>
                </NuxtLink>
              </li>
            </ul>
            <div class="flex flex-col gap-2 mt-6">
              <template v-if="!useAuth.state.token">
                <DefaultButton :ctaButton="true" @click="router.push('/login')">
                  <Icon name="LogIn" :stroke-width="2" />
                  Se connecter
                </DefaultButton>
              </template>
              <template v-else>
                <DefaultButton :ctaButton="true" @click="useAuth.signOut()">
                  <Icon name="LogOut" :stroke-width="2" />
                  Se déconnecter
                </DefaultButton>
              </template>
            </div>
          </div>
        </div>
      </transition>
    </nav>
  </header>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <div
        class="absolute w-20 h-20 sm:w-32 sm:h-32 bg-pink-200 opacity-30 rounded-full top-10 left-10 animate-pulse"
      ></div>
      <div
        class="absolute w-16 h-16 sm:w-24 sm:h-24 bg-blue-200 opacity-20 rounded-full bottom-20 right-20 animate-ping"
      ></div>
      <div
        class="absolute w-10 h-10 sm:w-16 sm:h-16 bg-yellow-100 opacity-20 rounded-full top-1/2 left-1/2 animate-bounce"
      ></div>
    </div>
    <main class="flex-1 px-home">
      <div class="mt-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import DefaultButton from "~/components/interaction/buttons/DefaultButton.vue";
import { sidebarItems } from "~/constants/Navigation";
import { useQuizStore } from "~/stores/quizStore";

const route = useRoute();
const router = useRouter();

const useAuth = authStore();
const useQuiz = useQuizStore();
const showMobileMenu = ref(false);
onMounted(() => {
  useQuiz.state.openModal = false;
});
</script>

<style scoped>
@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

.animate-float-slow {
  animation: float-slow 3.5s ease-in-out infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes slide-in-left {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

.animate-slide-in-left {
  animation: slide-in-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
