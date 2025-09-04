/**
 * Example integration of subscription checks in quiz creation
 * This file shows how to integrate subscription limitations in your existing components
 */

/* 
// In your quiz creation component (e.g., pages/quiz/create.vue):

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Subscription Warning -->
    <SubscriptionWarning 
      v-if="!canCreateQuiz"
      type="quiz-limit"
      class="mb-6"
      @close="showWarning = false"
      closable
    />

    <!-- Quiz Creation Form -->
    <Card>
      <CardHeader>
        <CardTitle>Créer un nouveau quiz</CardTitle>
      </CardHeader>
      
      <CardContent>
        <!-- Your existing quiz form here -->
        <form @submit.prevent="handleSubmit">
          <!-- Form fields -->
        </form>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          :disabled="!canCreateQuiz || loading"
          @click="handleCreateQuiz"
        >
          {{ !canCreateQuiz ? 'Limite atteinte' : 'Créer le quiz' }}
        </Button>
      </CardFooter>
    </Card>

    <!-- Subscription Features Display -->
    <SubscriptionFeatures class="mt-8" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SubscriptionWarning from '~/components/subscription/SubscriptionWarning.vue';
import SubscriptionFeatures from '~/components/subscription/SubscriptionFeatures.vue';
import { useSubscription } from '~/composables/useSubscription';
import { useUserStore } from '~/stores/userStore';

const { canCreateQuiz } = useSubscription();
const userStore = useUserStore();
const loading = ref(false);
const showWarning = ref(true);

const handleCreateQuiz = async () => {
  // Check subscription limits before proceeding
  const limitCheck = userStore.checkQuizCreationLimit();
  
  if (!limitCheck.canCreate) {
    // Show error message or redirect to subscription page
    console.error(limitCheck.message);
    return;
  }

  loading.value = true;
  
  try {
    // Your quiz creation logic here
    // await createQuiz(quizData);
    
    // Navigate to the created quiz
    // await navigateTo(`/quiz/edit/${newQuizId}`);
  } catch (error) {
    console.error('Error creating quiz:', error);
  } finally {
    loading.value = false;
  }
};
</script>

*/

/* 
// In your navigation component (e.g., layouts/default.vue):

<template>
  <div>
    <!-- Navigation -->
    <nav>
      <NuxtLink 
        to="/quiz/create"
        :class="[
          'nav-link',
          !canCreateQuiz ? 'opacity-50 cursor-not-allowed' : ''
        ]"
        @click="handleQuizCreationClick"
      >
        <Icon name="plus" />
        Créer un quiz
        <Badge v-if="remainingQuizzes !== -1 && remainingQuizzes <= 3" variant="outline" class="ml-2">
          {{ remainingQuizzes }} restant{{ remainingQuizzes > 1 ? 's' : '' }}
        </Badge>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { Badge } from '~/components/ui/badge';
import Icon from '@/components/Icon.vue';
import { useSubscription } from '~/composables/useSubscription';

const { canCreateQuiz, remainingQuizzes } = useSubscription();

const handleQuizCreationClick = (event: Event) => {
  if (!canCreateQuiz.value) {
    event.preventDefault();
    // Show subscription upgrade modal or redirect
    navigateTo('/subscription');
  }
};
</script>

*/

/* 
// In your quiz settings component where participants can be added:

<template>
  <div>
    <!-- Participant limit warning -->
    <SubscriptionWarning 
      v-if="!canAddParticipants"
      type="participant-limit"
      class="mb-4"
    />

    <!-- Participant management -->
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h3>Participants</h3>
        <Button 
          @click="addParticipant"
          :disabled="!canAddParticipants"
        >
          Ajouter un participant
        </Button>
      </div>
      
      <!-- Participants list -->
    </div>
  </div>
</template>

<script setup lang="ts">
import SubscriptionWarning from '~/components/subscription/SubscriptionWarning.vue';
import { useSubscription } from '~/composables/useSubscription';
import { useUserStore } from '~/stores/userStore';

const { quotaCheck } = useSubscription();
const userStore = useUserStore();

const canAddParticipants = computed(() => quotaCheck.value.can_add_participants);

const addParticipant = () => {
  const limitCheck = userStore.checkParticipantLimit(1);
  
  if (!limitCheck.canAdd) {
    // Handle limit reached
    console.error(limitCheck.message);
    return;
  }
  
  // Add participant logic
};
</script>

*/

/* 
// In a component that uses premium features (e.g., analytics):

<template>
  <div>
    <Card>
      <CardHeader>
        <CardTitle>Analyses du quiz</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div v-if="hasAnalytics">
          <!-- Analytics content -->
          <AnalyticsCharts :data="analyticsData" />
        </div>
        
        <div v-else class="text-center py-8">
          <Icon name="bar-chart" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Analyses premium
          </h3>
          <p class="text-gray-600 mb-4">
            Accédez à des analyses détaillées avec un plan premium.
          </p>
          <NuxtLink to="/subscription">
            <Button>Passer au premium</Button>
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/Icon.vue';
import { useSubscription } from '~/composables/useSubscription';

const { hasAnalytics } = useSubscription();
</script>

*/

export {};
