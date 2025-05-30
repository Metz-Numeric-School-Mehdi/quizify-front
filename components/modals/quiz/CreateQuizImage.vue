<template>
  <div v-if="currentStep === 2" class="px-2">
    <div class="mb-4">
      <label class="block font-semibold mb-1">Image du quiz</label>
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
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ currentStep: number }>()
const useQuiz = quizStore()

const imagePreview = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
}

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files && files[0]) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      imagePreview.value = ev.target?.result as string;
      if (useQuiz.state.createQuizForm && files && files[0]) {
        useQuiz.state.createQuizForm.thumbnail = files[0];
      }
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
      if (useQuiz.state.createQuizForm) {
        useQuiz.state.createQuizForm.thumbnail = file;
      }
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  imagePreview.value = null;
  if (useQuiz.state.createQuizForm) {
    useQuiz.state.createQuizForm.thumbnail = null;
  }
  if (fileInput.value) fileInput.value.value = "";
};
</script>
