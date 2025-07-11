<template>
  <div>
    <form class="grid gap-4" @submit="onSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField v-slot="{ componentField }" v-for="(items, index) in signUp" :name="items.name" :key="index"
          class="space-y-1">
          <FormItem v-auto-animate>
            <FormLabel :for="items.name"> {{ items.label }} </FormLabel>
            <FormControl>
              <Input v-model="store.state.signUpPayload[items.name]" :placeholder="items.placeholder" :type="items.type"
                required v-bind="componentField" :autocomplete="items.type === 'password' ? 'new-password' : 'off'" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="mb-4">
        <label class="block font-semibold mb-1">Photo de profil</label>
        <DragAndDropImage
          v-model="store.state.signUpPayload.photo"
          accept="image/*"
          :preview="true"
          label="Glissez-déposez une image ici ou cliquez pour sélectionner (optionnel)"
        />
      </div>
      <DefaultButton :ctaButton="true" class="justify-center" type="submit">
        Créer un compte
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
import DragAndDropImage from '@/components/common/DragAndDropImage.vue';

const store = authStore();

const formSchema = toTypedSchema(
  z
    .object({
      email: z.string().email("E-mail invalide"),
      password: z.string().min(6, "Mot de passe invalide"),
      confirmPassword: z.string().min(6),
      username: z.string().min(3, "Nom d'utilisateur invalide"),
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
