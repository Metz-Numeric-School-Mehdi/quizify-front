<template>
  <div class="grid gap-4">
    <form class="grid gap-4" @submit="onSubmit">
      <FormField
        v-slot="{ componentField }"
        v-for="(items, index) in signIn"
        :name="items.name"
        :key="index"
        class="space-y-1"
      >
        <FormItem v-auto-animate>
          <FormLabel :for="items.name"> {{ items.placeholder }} </FormLabel>
          <FormControl>
            <Input
              v-model="store.state.signInPayload[items.name]"
              :type="items.type"
              required
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit" class="w-full"> Se connecter </Button>
    </form>
    <Button variant="outline" class="w-full">
      Se connecter avec Google
      <Google />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { toast } from "@/components/ui/toast";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Google from "@/components/icons/Google.vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { signIn } from "~/constants/Auth";
import { authStore } from '~/stores/authStore'

const store = authStore();

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email("E-mail invalide"),
    password: z.string().min(6, "Mot de passe invalide"),
  }),
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  await store.signIn(values.email, values.password);
  if (!store.state.isAuthenticated) {
    toast({
      title: "Échec de la connexion",
      description: store.state.responseErrors,
      variant: "destructive",
    });
  }
});
</script>
