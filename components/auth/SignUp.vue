<template>
  <div class="w-full max-w-lg mx-auto space-y-6">
    <form class="space-y-6" @submit="onSubmit">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField v-slot="{ componentField }" v-for="(items, index) in signUp" :name="items.name" :key="index"
          class="space-y-2">
          <FormItem v-auto-animate>
            <FormLabel :for="items.name" class="text-sm font-medium">
              {{ items.label }}
            </FormLabel>
            <FormControl>
              <Input v-model="store.state.signUpPayload[items.name]" :placeholder="items.placeholder" :type="items.type"
                required v-bind="componentField" :autocomplete="items.type === 'password' ? 'new-password' : 'off'"
                class="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div class="space-y-2">
        <AvatarSelector v-model="store.state.signUpPayload.avatar" />
      </div>

      <DefaultButton :ctaButton="true" class="w-full justify-center py-3 text-base font-medium" type="submit">
        Créer mon compte
      </DefaultButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import DefaultButton from "@/components/interaction/buttons/DefaultButton.vue";
import { Input } from "@/components/ui/input";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { toast } from "@/components/ui/toast";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { signUp } from "~/constants/Auth";
import { authStore } from '~/stores/authStore'
import AvatarSelector from '@/components/common/AvatarSelector.vue';

const store = authStore();

const formSchema = toTypedSchema(
  z
    .object({
      email: z.string({ required_error: "L'e-mail est requis" })
      .email("E-mail invalide"),
      password: z.string({ required_error: "Le mot de passe est requis" })
      .min(6, "Mot de passe invalide"),
      confirmPassword: z.string({ required_error: "La confirmation du mot de passe est requise" })
      .min(6, "Mot de passe invalide"),
      username: z.string({ required_error: "Le nom d'utilisateur est requis" })
      .min(3, "Nom d'utilisateur invalide"),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
      });
      }
    }),
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  await store.signUp(store.state.signUpPayload);
  if (!store.state.isAuthenticated) {
    toast({
      title: "Échec de la connexion",
      description: store.state.responseErrors,
      variant: "destructive",
    });
  }
});
</script>
