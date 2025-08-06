<template>
  <div class="flex flex-col gap-4 relative">
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <div
        class="absolute w-32 h-32 bg-pink-200 opacity-30 rounded-full top-10 left-10 animate-pulse"
      ></div>
      <div
        class="absolute w-24 h-24 bg-blue-200 opacity-20 rounded-full bottom-20 right-20 animate-ping"
      ></div>
      <div
        class="absolute w-16 h-16 bg-yellow-200 opacity-20 rounded-full top-1/2 left-1/2 animate-bounce"
      ></div>
      <div
        class="absolute w-20 h-20 bg-purple-200 opacity-10 rounded-full bottom-10 left-1/3 animate-spin-slow"
      ></div>
    </div>
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 z-10">
      <h1 class="text-[2rem] font-bold text-pink-600 w-full">Classement</h1>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <label for="order-select" class="text-sm whitespace-nowrap font-medium text-gray-700 w-full sm:w-auto">Tri :</label>
        <Select v-model="order" id="order-select" @update:modelValue="onOrderChange" class="w-full sm:w-[260px]">
          <SelectTrigger class="w-full sm:w-[260px]">
            <SelectValue placeholder="Choisir le tri" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Score décroissant</SelectItem>
            <SelectItem value="asc">Score croissant</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div v-if="loading" class="flex justify-center items-center py-10">
      <span class="text-pink-500 font-semibold">Chargement...</span>
    </div>
    <div v-else-if="error" class="flex justify-center items-center py-10">
      <span class="text-red-500 font-semibold">{{ error }}</span>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-xl shadow divide-y divide-gray-200">
        <thead class="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">#</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Utilisateur</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Score</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Quiz complétés</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in leaderboardData" :key="entry.id" class="hover:bg-pink-50 transition">
            <td class="px-4 py-2 font-bold text-pink-600">{{ entry.ranking }}</td>
            <td class="px-4 py-2 flex items-center gap-3">
              <img
                v-if="entry.profile_photo"
                :src="entry.profile_photo"
                alt="Photo"
                class="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <div>
                <div class="font-semibold text-gray-800">{{ entry.username }}</div>
                <div class="text-xs text-gray-500">{{ entry.firstname }} {{ entry.lastname }}</div>
              </div>
            </td>
            <td class="px-4 py-2 font-semibold text-purple-700">{{ entry.total_score }}</td>
            <td class="px-4 py-2 text-gray-700">{{ entry.quizzes_completed }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="pagination && pagination.last_page > 1" class="flex justify-center mt-8 gap-2">
        <button
          v-for="link in pagination.links"
          :key="link.label"
          :disabled="!link.url || link.active"
          @click="goToPage(link)"
          class="px-3 py-1 rounded font-medium transition"
          :class="[
            link.active ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-100',
            !link.url ? 'opacity-50 cursor-not-allowed' : '',
          ]"
        >
          <span v-if="link.label === 'pagination.previous'">Précédent</span>
          <span v-else-if="link.label === 'pagination.next'">Suivant</span>
          <span v-else>{{ link.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLeaderboardStore } from "~/stores/leaderboardStore";
import type { LeaderboardEntry } from "~/types/leaderboard/LeaderboardEntry";
import type { LeaderboardPagination } from "~/types/leaderboard/LeaderboardPagination";
import type { PaginationLink } from "~/types/leaderboard/LeaderboardPagination";

const props = defineProps<{
  categoryId?: number;
  organizationId?: number;
}>();

const leaderboardStore = useLeaderboardStore();
const loading = computed(() => leaderboardStore.state.loading);
const error = computed(() => leaderboardStore.state.error);

const leaderboardData = computed<LeaderboardEntry[]>(
  () => leaderboardStore.state.leaderboard?.data?.data ?? [],
);

const pagination = computed<LeaderboardPagination | null>(
  () => leaderboardStore.state.leaderboard?.data ?? null,
);

// Ajout du tri
const order = ref<"asc" | "desc">("desc");

const fetchLeaderboard = (page = 1) => {
  if (props.categoryId) {
    leaderboardStore.getLeaderboardByCategory(props.categoryId, page, order.value);
  } else if (props.organizationId) {
    leaderboardStore.getLeaderboardByOrganization(props.organizationId, page, order.value);
  } else {
    leaderboardStore.getGlobalLeaderboard(page, order.value);
  }
};

const goToPage = (link: PaginationLink) => {
  if (link.url && !link.active) {
    const url = new URL(link.url);
    const page = Number(url.searchParams.get("page")) || 1;
    fetchLeaderboard(page);
  }
};

const onOrderChange = () => {
  fetchLeaderboard(1);
};

onMounted(() => {
  fetchLeaderboard(1);
});

watch(order, () => {
  fetchLeaderboard(1);
});
</script>

<style scoped>
@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
