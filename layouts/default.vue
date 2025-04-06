<template>
  <div class="flex items-center justify-between gap-2 p-5">
    <img class="w-16" src="../assets/img/icon.png" alt="Icon quizify" />
    <div class="flex items-center gap-2">
      <ThemeToggle />
      <HomeUserNav />
    </div>
  </div>
  <DropdownMenuSeparator class="w-full" />
  <slot />
</template>

<script setup lang="ts"></script>
