<template>
  <div>
    <form class="grid gap-4" @submit="onSubmit">
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
      <div class="mb-4">
        <label class="block font-semibold mb-1">Photo de profil</label>
        <div
          class="w-full flex flex-col items-center justify-center border-2 border-dashed border-pink-400 rounded-md py-6 px-3 cursor-pointer bg-pink-50 hover:bg-pink-100 transition"
          @dragover.prevent @drop.prevent="onDrop" @click="triggerFileInput">
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
          <template v-if="imagePreview">
            <img :src="imagePreview" alt="Aperçu" class="max-h-32 mb-2 rounded" />
            <button type="button" class="text-xs text-pink-500 underline" @click.stop="removeImage">
              Retirer l'image
            </button>
          </template>
          <template v-else>
            <span class="flex flex-col items-center gap-2 text-pink-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-pink-300" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 16v-8m0 0l-3.5 3.5M12 8l3.5 3.5M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 16v2M8 16v2" />
              </svg>
              Glissez-déposez une image ici ou cliquez pour sélectionner
            </span>
          </template>
        </div>
      </div>
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
const imagePreview = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files && files[0]) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      imagePreview.value = ev.target?.result as string;
      store.state.signUpPayload.photo = files[0];
    };
    reader.readAsDataURL(files[0]);
  }
};

const onDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      imagePreview.value = ev.target?.result as string;
      store.state.signUpPayload.photo = file;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  imagePreview.value = null;
  store.state.signUpPayload.photo = null;
  if (fileInput.value) fileInput.value.value = "";
};
</script>
