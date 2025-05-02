<template>
  <div class="md:hidden mt-10 px-6">
    <template v-if="!sideIsCollapsible">
      <Icon @click="sideIsCollapsible = !sideIsCollapsible" name="Menu" class="cursor-pointer md:hidden" />
    </template>
    <template v-else>
      <Icon @click="sideIsCollapsible = !sideIsCollapsible" name="X" class="cursor-pointer md:hidden" />
    </template>
  </div>

  <div class="flex h-screen">
    <nav class="hidden w-64 px-6 pt-10 pb-6 md:flex flex-col gap-8 overflow-y-auto fixed left-0 top-0 h-screen z-10">
      <img src="../assets/img/icon.png" alt="Icon quizify" class="w-16 h-16 mb-4" />
      <ul class="flex flex-col gap-4">
        <li v-for="(link, index) in sidebarItems" :key="index">
          <NuxtLink :to="link.path" :class="[
            'h-12 font-semibold px-5 text-body flex items-center duration-200 gap-4 rounded-default',
            $route.path === link.path
              ? 'bg-primary-linear bg-gradient-to-r from-primary-linear to-secondary-linear text-white'
              : 'text-text-color hover:text-primary-linear'
          ]">
            <Icon :class="[$route.path === link.path ? 'text-white' : 'text-primary-linear']" :stroke-width="2"
              :name="link.icon" />
            {{ link.name }}
          </NuxtLink>
        </li>
      </ul>
      <div class="mt-auto flex flex-col gap-6">
        <Support />
        <Button
          class="relative overflow-hidden text-white flex items-center gap-4 px-6 py-2 bg-gradient-to-r from-primary-linear to-secondary-linear transition-colors duration-300 group">
          <span
            class="absolute inset-0 bg-gradient-to-r from-primary-linear via-[#7f5af0] to-secondary-linear bg-[length:200%] bg-left group-hover:bg-right transition-all duration-1000 ease-in-out z-0">
          </span>
          <span class="relative z-10 flex items-center gap-4">
            <Icon name="LogIn" :stroke-width="2" />
            Se connecter
          </span>
        </Button>
      </div>
    </nav>

    <div class="flex-grow md:ml-64 overflow-y-auto h-screen px-4">
      <Searchbar class="my-10"/>
      <slot />
    </div>
  </div>
</template>


<script setup lang="ts">
import Support from '~/components/sidebar/Support.vue';
import Searchbar from '~/components/home/Searchbar.vue';
import { sidebarItems } from '~/constants/Navigation';

const sideIsCollapsible = ref(false);
</script>
