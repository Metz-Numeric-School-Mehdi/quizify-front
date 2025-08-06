<template>
  <LeaderboardDisplay />
</template>

<script setup lang="ts">
const LeaderboardDisplay = defineAsyncComponent(
  () => import("~/components/leaderboard/LeaderboardDisplay.vue"),
);

definePageMeta({
  layout: "default",
});
</script>
