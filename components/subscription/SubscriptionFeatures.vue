<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-lg">Votre plan</h3>
      <Badge :variant="isFreePlan ? 'outline' : 'default'">
        {{ currentPlan?.name || 'Aucun plan' }}
      </Badge>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-2">
            <Icon name="file-text" class="h-4 w-4" />
            <span class="text-sm font-medium">Quiz</span>
          </div>
          <div class="text-right">
            <div class="text-sm font-semibold">
              {{ currentSubscription?.usage.quizzes_created || 0 }}
              <span v-if="currentPlan?.features.max_quizzes !== -1" class="text-muted-foreground">
                / {{ currentPlan?.features.max_quizzes }}
              </span>
            </div>
            <div v-if="currentPlan?.features.max_quizzes !== -1" class="w-16 bg-gray-200 rounded-full h-1 mt-1">
              <div 
                class="bg-blue-600 h-1 rounded-full" 
                :style="{ width: `${getUsagePercentage(currentSubscription?.usage.quizzes_created || 0, currentPlan?.features.max_quizzes || 0)}%` }"
              ></div>
            </div>
            <div v-else class="text-xs text-green-600">Illimité</div>
          </div>
        </div>

        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-2">
            <Icon name="users" class="h-4 w-4" />
            <span class="text-sm font-medium">Participants ce mois</span>
          </div>
          <div class="text-right">
            <div class="text-sm font-semibold">
              {{ currentSubscription?.usage.current_month_participants || 0 }}
              <span v-if="currentPlan?.features.max_participants !== -1" class="text-muted-foreground">
                / {{ currentPlan?.features.max_participants }}
              </span>
            </div>
            <div v-if="currentPlan?.features.max_participants !== -1" class="w-16 bg-gray-200 rounded-full h-1 mt-1">
              <div 
                class="bg-green-600 h-1 rounded-full" 
                :style="{ width: `${getUsagePercentage(currentSubscription?.usage.current_month_participants || 0, currentPlan?.features.max_participants || 0)}%` }"
              ></div>
            </div>
            <div v-else class="text-xs text-green-600">Illimité</div>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-2">
            <Icon name="bar-chart" class="h-4 w-4" />
            <span class="text-sm font-medium">Analyses</span>
          </div>
          <div class="flex items-center space-x-1">
            <Icon 
              :name="hasAnalytics ? 'check' : 'x'" 
              :class="['h-4 w-4', hasAnalytics ? 'text-green-500' : 'text-red-500']" 
            />
            <span :class="['text-xs', hasAnalytics ? 'text-green-600' : 'text-red-600']">
              {{ hasAnalytics ? 'Inclus' : 'Non inclus' }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-2">
            <Icon name="palette" class="h-4 w-4" />
            <span class="text-sm font-medium">Personnalisation</span>
          </div>
          <div class="flex items-center space-x-1">
            <Icon 
              :name="hasCustomBranding ? 'check' : 'x'" 
              :class="['h-4 w-4', hasCustomBranding ? 'text-green-500' : 'text-red-500']" 
            />
            <span :class="['text-xs', hasCustomBranding ? 'text-green-600' : 'text-red-600']">
              {{ hasCustomBranding ? 'Inclus' : 'Non inclus' }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-2">
            <Icon name="code" class="h-4 w-4" />
            <span class="text-sm font-medium">API</span>
          </div>
          <div class="flex items-center space-x-1">
            <Icon 
              :name="hasApiAccess ? 'check' : 'x'" 
              :class="['h-4 w-4', hasApiAccess ? 'text-green-500' : 'text-red-500']" 
            />
            <span :class="['text-xs', hasApiAccess ? 'text-green-600' : 'text-red-600']">
              {{ hasApiAccess ? 'Inclus' : 'Non inclus' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isFreePlan" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-start space-x-3">
        <Icon name="info" class="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 class="font-medium text-blue-800 mb-1">Passez à un plan premium</h4>
          <p class="text-sm text-blue-700 mb-3">
            Débloquez plus de fonctionnalités et supprimez les limites avec nos plans payants.
          </p>
          <NuxtLink 
            to="/subscription"
            class="inline-flex items-center space-x-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
          >
            <Icon name="arrow-up" class="h-3 w-3" />
            <span>Voir les plans</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Badge } from '~/components/ui/badge';
import Icon from '@/components/Icon.vue';
import { useSubscription } from '~/composables/useSubscription';

const { 
  currentSubscription, 
  currentPlan, 
  isFreePlan, 
  hasAnalytics, 
  hasApiAccess, 
  hasCustomBranding, 
  getUsagePercentage 
} = useSubscription();
</script>
