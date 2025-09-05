<template>
  <div v-if="showWarning" class="border border-orange-200 bg-orange-50 rounded-lg p-4">
    <div class="flex items-start space-x-3">
      <Icon name="alert-triangle" class="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
      
      <div class="flex-1">
        <h4 class="font-medium text-orange-800 mb-1">
          Limite d'abonnement atteinte
        </h4>
        
        <p class="text-sm text-orange-700 mb-3">
          {{ message }}
        </p>
        
        <div v-if="showUpgrade" class="flex flex-wrap gap-2">
          <NuxtLink 
            to="/subscription"
            class="inline-flex items-center space-x-1 text-xs bg-orange-600 text-white px-3 py-1.5 rounded hover:bg-orange-700 transition-colors"
          >
            <Icon name="arrow-up" class="h-3 w-3" />
            <span>Améliorer le plan</span>
          </NuxtLink>
          
          <button 
            v-if="showDismiss"
            @click="dismiss"
            class="text-xs text-orange-600 hover:text-orange-800 px-2 py-1.5 border border-orange-300 rounded hover:bg-orange-100 transition-colors"
          >
            Ignorer
          </button>
        </div>
      </div>
      
      <button 
        v-if="closable"
        @click="$emit('close')"
        class="text-orange-400 hover:text-orange-600"
      >
        <Icon name="x" class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Icon from '@/components/Icon.vue';
import { useSubscription } from '~/composables/useSubscription';

interface Props {
  type: 'quiz-limit' | 'participant-limit' | 'feature-unavailable';
  feature?: string;
  showUpgrade?: boolean;
  showDismiss?: boolean;
  closable?: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'dismiss'): void;
}

const props = withDefaults(defineProps<Props>(), {
  showUpgrade: true,
  showDismiss: false,
  closable: false
});

const emit = defineEmits<Emits>();

const { 
  currentSubscription, 
  remainingQuizzes, 
  quotaCheck,
  isFreePlan 
} = useSubscription();

const dismissed = ref(false);

const showWarning = computed(() => {
  if (dismissed.value) return false;
  
  switch (props.type) {
    case 'quiz-limit':
      return remainingQuizzes.value === 0 || !quotaCheck.value.can_create_quiz;
    case 'participant-limit':
      return !quotaCheck.value.can_add_participants;
    case 'feature-unavailable':
      return isFreePlan.value;
    default:
      return false;
  }
});

const message = computed(() => {
  switch (props.type) {
    case 'quiz-limit':
      if (isFreePlan.value) {
        return `Vous avez atteint la limite de ${currentSubscription.value?.plan.features.max_quizzes} quiz du plan gratuit.`;
      }
      return `Vous avez utilisé tous vos quiz (${currentSubscription.value?.usage.quizzes_created}/${currentSubscription.value?.plan.features.max_quizzes}).`;
      
    case 'participant-limit':
      if (isFreePlan.value) {
        return `Vous avez atteint la limite de ${currentSubscription.value?.plan.features.max_participants} participants ce mois-ci.`;
      }
      return `Vous avez atteint la limite de participants pour votre plan ce mois-ci.`;
      
    case 'feature-unavailable':
      return `La fonctionnalité "${props.feature}" n'est pas disponible avec le plan gratuit.`;
      
    default:
      return 'Limitation d\'abonnement atteinte.';
  }
});

const dismiss = () => {
  dismissed.value = true;
  emit('dismiss');
};
</script>
