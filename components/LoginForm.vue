<template>
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        Se connecter
      </CardTitle>
      <CardDescription>
        Saisissez vos informations de connexion pour accéder à votre compte.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <form class="grid gap-4" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem v-auto-animate>
              <FormLabel for="email">
                Email
              </FormLabel>
              <FormControl>
                <Input id="email" v-model="auth.email" type="email" placeholder="Adresse mail" v-bind="componentField"
                  required />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem v-auto-animate>
              <FormLabel for="email">
                Mot de passe
              </FormLabel>
              <FormControl>
                <Input id="password" type="password" v-model="auth.password" placeholder="Mot de passe"
                  v-bind="componentField" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" class="w-full">
            Se connecter
          </Button>
        </form>
        <Button variant="outline" class="w-full">
          Se connecter avec Google
          <Google />
        </Button>
      </div>
      <div class="mt-4 text-center text-sm">
        Pas de compte ?
        <a href="#" class="underline">
          Créer en un
        </a>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { toast } from '@/components/ui/toast'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Google from '@/components/icons/Google.vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import type Auth from '~/types/auth/Auth'

const store = authStore()

const auth = ref<Auth>({
  email: '',
  password: ''
})

const formSchema = toTypedSchema(z.object({
  email: z.string().email('E-mail invalide'),
  password: z.string().min(6, 'Mot de passe invalide'),
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit( async (values) => {
  await store.signIn(auth.value.email, auth.value.password)
  toast({
    title: 'Erreur lors de la connexion',
    description: store.state.responseErrors
  })
})
</script>