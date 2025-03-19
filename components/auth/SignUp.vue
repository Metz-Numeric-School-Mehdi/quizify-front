<template>
  <div>
    <form class="grid gap-4" @submit="onSubmit">
      <FormField
        v-slot="{ componentField }"
        v-for="(items, index) in signUp"
        :name="items.name"
        :key="index"
        class="space-y-1"
      >
        <FormItem v-auto-animate>
          <FormLabel :for="items.name"> {{ items.label }} </FormLabel>
          <FormControl>
            <Input
              v-model="store.state.signUpPayload[items.name]"
              :placeholder="items.placeholder"
              :type="items.type"
              required
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit">Créer un compte</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { toast } from "@/components/ui/toast";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { signUp } from "~/constants/Auth";

const store = authStore();

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email("E-mail invalide"),
    password: z.string().min(6, "Mot de passe invalide"),
    username: z.string().min(3, "Nom d'utilisateur invalide"),
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
