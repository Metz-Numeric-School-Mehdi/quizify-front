<template>
    <div class="w-full flex flex-col items-center justify-center border-2 border-dashed border-pink-400 rounded-md py-6 px-3 cursor-pointer bg-pink-50 hover:bg-pink-100 transition relative"
        :class="{ 'opacity-50 pointer-events-none': disabled }" @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave" @drop.prevent="onDrop" @click="triggerFileInput" :aria-disabled="disabled"
        tabindex="0" @keydown.enter.prevent="triggerFileInput">
        <input ref="fileInput" type="file" :accept="accept" :multiple="multiple" class="hidden" :disabled="disabled"
            @change="onFileChange" />
        <template v-if="preview && filePreview">
            <div v-if="isImage" class="flex flex-col items-center">
                <img :src="filePreview" alt="Aperçu" class="max-h-32 mb-2 rounded" />
            </div>
            <div v-else class="flex flex-col items-center">
                <span class="text-xs text-gray-500 mb-2">{{ fileName }}</span>
            </div>
            <button v-if="!disabled" type="button" class="text-xs text-pink-500 underline" @click.stop="removeFile">
                Retirer l'image
            </button>
        </template>
        <template v-else>
            <span class="flex flex-col items-center gap-2 text-pink-400 text-sm">
                <slot name="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-pink-300" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 16v-8m0 0l-3.5 3.5M12 8l3.5 3.5M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 16v2M8 16v2" />
                    </svg>
                </slot>
                <span class="text-center">{{ label }}</span>
            </span>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

type DragAndDropImageProps = {
    accept?: string;
    multiple?: boolean;
    label?: string;
    preview?: boolean;
    modelValue?: File | null;
    disabled?: boolean;
}

const props = defineProps<DragAndDropImageProps>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: File | null): void;
    (e: 'change', value: File | null): void;
    (e: 'remove'): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const filePreview = ref<string | null>(null);
const fileName = computed(() =>
    props.modelValue instanceof File ? props.modelValue.name : ''
);
const isImage = computed(() =>
    props.modelValue instanceof File && props.modelValue.type.startsWith('image/')
);

watch(() => props.modelValue, (val) => {
    if (props.preview) {
        if (val instanceof File && val.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                filePreview.value = e.target?.result as string;
            };
            reader.readAsDataURL(val);
        } else {
            filePreview.value = null;
        }
    }
}, { immediate: true });

const triggerFileInput = () => {
    if (!props.disabled) fileInput.value?.click();
};

const onFileChange = (e: Event) => {
    if (props.disabled) return;
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;
    const value: File | null = files[0] || null;
    emit('update:modelValue', value);
    emit('change', value);
};

const onDrop = (e: DragEvent) => {
    if (props.disabled) return;
    const files = e.dataTransfer?.files;
    if (!files) return;
    const value: File | null = files[0] || null;
    emit('update:modelValue', value);
    emit('change', value);
};

const removeFile = () => {
    emit('update:modelValue', null);
    emit('remove');
    filePreview.value = null;
    if (fileInput.value) fileInput.value.value = '';
};

const onDragOver = (e: DragEvent) => {
    if (props.disabled) return;
    e.dataTransfer!.dropEffect = 'copy';
};
const onDragLeave = () => { };
</script>

<style scoped>
[aria-disabled="true"] {
    pointer-events: none;
    opacity: 0.5;
}
</style>
