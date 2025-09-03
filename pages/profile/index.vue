<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="w-full max-w-2xl mx-auto space-y-8">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div class="flex-shrink-0">
            <div v-if="auth.state.user?.avatar || auth.state.user?.profile_photo" class="relative">
              <img :src="auth.state.user?.profile_photo || auth.state.user?.avatar" :alt="userDisplayName"
                class="w-24 h-24 rounded-full border-4 border-gray-200" />
            </div>
            <div v-else
              class="w-24 h-24 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
              <Icon name="User" class="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-2xl font-bold text-gray-900">{{ userDisplayName }}</h1>
            <p class="text-gray-600">@{{ auth.state.user?.username }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ auth.state.user?.email }}</p>
            <div v-if="subscriptionPlan" class="mt-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {{ subscriptionPlan }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Modifier mon profil</h2>

        <form class="space-y-6" @submit.prevent="onSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField v-slot="{ componentField }" name="firstname">
              <FormItem>
                <FormLabel class="text-sm font-medium">Prénom</FormLabel>
                <FormControl>
                  <Input v-model="store.state.updateProfilePayload.firstname" placeholder="Votre prénom" type="text"
                    v-bind="componentField" class="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="lastname">
              <FormItem>
                <FormLabel class="text-sm font-medium">Nom</FormLabel>
                <FormControl>
                  <Input v-model="store.state.updateProfilePayload.lastname" placeholder="Votre nom" type="text"
                    v-bind="componentField" class="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel class="text-sm font-medium">Nom d'utilisateur</FormLabel>
                <FormControl>
                  <Input v-model="store.state.updateProfilePayload.username" placeholder="Nom d'utilisateur" type="text"
                    v-bind="componentField" class="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel class="text-sm font-medium">Email</FormLabel>
                <FormControl>
                  <Input v-model="store.state.updateProfilePayload.email" placeholder="votre@email.com" type="email"
                    v-bind="componentField" class="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="space-y-2">
            <AvatarSelector v-model="store.state.updateProfilePayload.avatar" />
          </div>

          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <Button @click="resetForm" variant="outline" class="flex-1 justify-center py-3 text-base font-medium"
              type="button">
              Annuler
            </Button>

            <Button class="flex-1 justify-center py-3 text-base font-medium" type="submit"
              :disabled="store.state.isUpdating">
              <Icon v-if="store.state.isUpdating" name="Loader2" class="w-4 h-4 mr-2 animate-spin" />
              {{ store.state.isUpdating ? 'Mise à jour...' : 'Sauvegarder les modifications' }}
            </Button>
          </div>
        </form>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">0</div>
            <div class="text-sm text-gray-600">Quiz créés</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">0</div>
            <div class="text-sm text-gray-600">Quiz terminés</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">0</div>
            <div class="text-sm text-gray-600">Points</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">-</div>
            <div class="text-sm text-gray-600">Classement</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { useToast } from "@/components/ui/toast/use-toast"

const { toast } = useToast()

definePageMeta({
  title: 'Mon Profil'
})

const auth = authStore()
const store = userStore()

const profileFormSchema = z.object({
  firstname: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastname: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email('Email invalide'),
  avatar: z.string().optional()
})

const formSchema = toTypedSchema(profileFormSchema)

const { handleSubmit, resetForm: resetFormFields, setFieldValue } = useForm({
  validationSchema: formSchema
})

const userDisplayName = computed(() => {
  if (auth.state.user?.firstname && auth.state.user?.lastname) {
    return `${auth.state.user.firstname} ${auth.state.user.lastname}`
  }
  return auth.state.user?.username || 'Utilisateur'
})

const subscriptionPlan = computed(() => {
  return null
})

const initializeForm = () => {
  if (auth.state.user) {
    const user = auth.state.user

    store.state.updateProfilePayload = {
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      username: user.username || '',
      email: user.email || '',
      avatar: user.avatar || ''
    }

    setFieldValue('firstname', user.firstname || '')
    setFieldValue('lastname', user.lastname || '')
    setFieldValue('username', user.username || '')
    setFieldValue('email', user.email || '')
    setFieldValue('avatar', user.avatar || '')
  }
}

const resetForm = () => {
  initializeForm()
  resetFormFields()
}

const onSubmit = handleSubmit(async (values) => {
  try {
    const success = await store.updateProfile(store.state.updateProfilePayload)

    if (success) {
      toast({
        title: 'Profil mis à jour',
        description: 'Vos modifications ont été enregistrées avec succès.',
      });
    } else {
      toast({
        title: 'Erreur',
        description: 'La mise à jour du profil a échoué. Veuillez réessayer.',
      });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
  }
})

onMounted(() => {
  initializeForm()
})
</script>

<style></style>