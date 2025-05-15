<template>
  <!-- Bouton menu mobile -->
  <div class="fixed top-4 left-4 z-30 md:hidden">
    <button @click="sideIsCollapsible = !sideIsCollapsible"
      class="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 p-2 rounded-full shadow-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition">
      <Icon :name="sideIsCollapsible ? 'X' : 'Menu'" class="w-7 h-7" />
    </button>
  </div>

  <div class="flex h-screen">
    <nav :class="[
      'fixed top-0 left-0 z-20 overflow-hidden h-screen w-64 px-6 pt-10 pb-6 flex flex-col gap-8 overflow-y-auto bg-gradient-to-b from-pink-300 via-purple-300 to-blue-300 shadow-2xl transition-transform duration-300',
      sideIsCollapsible ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0 md:static md:flex'
    ]">
      <div class="flex flex-col items-center mb-6 z-10">
        <img src="../assets/img/mascotte_quiz.png" alt="Mascotte Quiz"
          class="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg border-4 border-white mb-2 animate-float-slow transition-all duration-300" />
        <span class="font-bold text-lg text-purple-700 drop-shadow text-center">Quizify</span>
      </div>
      <div class="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div
          class="absolute w-16 h-16 sm:w-24 sm:h-24 bg-yellow-200 opacity-10 rounded-full bottom-20 right-6 animate-ping">
        </div>
        <div
          class="absolute w-8 h-8 sm:w-10 sm:h-10 bg-blue-200 opacity-20 rounded-full bottom-10 left-24 animate-bounce">
        </div>
      </div>
      <ul class="flex flex-col gap-4 z-10">
        <li v-for="(link, index) in sidebarItems" :key="index">
          <NuxtLink :to="link.path" :class="[
            'h-12 font-semibold px-5 text-body flex items-center duration-200 gap-4 rounded-default relative overflow-hidden group transition-transform',
            $route.path === link.path
              ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white shadow-lg scale-105'
              : 'text-text-color hover:bg-purple-100 hover:scale-105 hover:shadow-md',
          ]" @click="sideIsCollapsible = false">
            <Icon :class="[$route.path === link.path ? 'text-white' : 'text-primary-linear']" :stroke-width="2"
              :name="link.icon" />
            <span class="ml-2">{{ link.name }}</span>
            <span v-if="$route.path === link.path"
              class="absolute right-2 top-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></span>
          </NuxtLink>
        </li>
      </ul>
      <div class="mt-auto flex flex-col gap-6 z-10">
        <Support />
        <template v-if="!useAuth.state.token">
          <NuxtLink to="/login"
            class="relative rounded-default overflow-hidden text-white flex items-center gap-4 px-6 py-2 bg-gradient-to-r from-primary-linear to-secondary-linear transition-colors duration-300 group">
            <span
              class="absolute inset-0 bg-gradient-to-r from-primary-linear via-[#7f5af0] to-secondary-linear bg-[length:200%] bg-left group-hover:bg-right transition-all duration-1000 ease-in-out z-0">
            </span>
            <span class="relative z-10 flex items-center gap-4">
              <Icon name="LogIn" :stroke-width="2" />
              Se connecter
            </span>
          </NuxtLink>
        </template>
        <template v-else>
          <Button @click="useAuth.signOut()">
            <Icon name="LogOut" :stroke-width="2" />
            Se déconnecter
          </Button>
        </template>
      </div>
    </nav>

    <div v-if="sideIsCollapsible" class="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
      @click="sideIsCollapsible = false"></div>

    <div
      class="flex-grow overflow-y-auto h-screen px-2 sm:px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative">
      <div class="absolute inset-0 -z-10 pointer-events-none">
        <div
          class="absolute w-20 h-20 sm:w-32 sm:h-32 bg-pink-200 opacity-30 rounded-full top-10 left-10 animate-pulse">
        </div>
        <div
          class="absolute w-16 h-16 sm:w-24 sm:h-24 bg-blue-200 opacity-20 rounded-full bottom-20 right-20 animate-ping">
        </div>
        <div
          class="absolute w-10 h-10 sm:w-16 sm:h-16 bg-yellow-100 opacity-20 rounded-full top-1/2 left-1/2 animate-bounce">
        </div>
      </div>
      <Searchbar class="my-10" />
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Support from "~/components/sidebar/Support.vue";
import Searchbar from "~/components/home/Searchbar.vue";
import { sidebarItems } from "~/constants/Navigation";
import { ref } from 'vue';

const sideIsCollapsible = ref(false);

const useAuth = authStore();
const useQuiz = quizStore();
onMounted(() => {
  useQuiz.state.openModal = false
})
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
</style>
