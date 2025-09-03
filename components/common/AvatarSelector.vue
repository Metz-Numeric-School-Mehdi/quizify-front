<template>
    <div class="space-y-4">
        <div class="flex flex-col space-y-3">
            <label class="text-sm font-medium">Avatar de profil</label>

            <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                    <div v-if="selectedAvatar" class="relative">
                        <img :src="selectedAvatar.url" :alt="`Avatar ${selectedAvatar.style}`"
                            class="w-16 h-16 rounded-full border-2 border-gray-200" />
                    </div>
                    <div v-else
                        class="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                        <Icon name="User" class="w-6 h-6 text-gray-400" />
                    </div>
                </div>

                <Button type="button" @click.stop="openAvatarSelection" variant="outline" size="sm" data-avatar-trigger>
                    <Icon name="ImageIcon" class="w-4 h-4 mr-2" />
                    {{ selectedAvatar ? 'Changer d\'avatar' : 'Choisir un avatar' }}
                </Button>
            </div>
        </div>

        <Sheet v-model:open="isDialogOpen">
            <SheetContent side="bottom" class="min-h-[60vh] sm:min-h-[50vh]">
                <SheetHeader>
                    <SheetTitle>Choisissez votre avatar</SheetTitle>
                    <SheetDescription>
                        Sélectionnez un avatar parmi notre collection
                    </SheetDescription>
                </SheetHeader>

                <div class="space-y-4 mt-6">
                    <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-96 overflow-y-auto p-1">
                        <div v-for="(avatar, index) in avatars" :key="index" @click="selectAvatar(avatar)" :class="[
                            'relative p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105',
                            selectedAvatar?.url === avatar.url
                                ? 'border-primary bg-primary/10 ring-2 ring-primary ring-offset-1'
                                : 'border-gray-200 hover:border-gray-300'
                        ]">
                            <img :src="avatar.url" :alt="`Avatar ${avatar.style}`" class="w-full h-auto rounded-md"
                                loading="lazy" />
                            <div v-if="selectedAvatar?.url === avatar.url" class="absolute -top-1 -right-1">
                                <div class="bg-primary text-primary-foreground rounded-full p-1">
                                    <Icon name="Check" class="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <SheetFooter class="mt-6 max-md:flex-col flex gap-2 items-center">
                    <Button class="w-full" @click="isDialogOpen = false" variant="outline">
                        Annuler
                    </Button>
                    <Button class="w-full" @click="confirmSelection" :disabled="!selectedAvatar">
                        Confirmer
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import Icon from '@/components/Icon.vue'

interface Avatar {
    url: string
    style: string
    seed: string
}

interface Props {
    modelValue?: string
}

interface Emits {
    (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const avatarStyles = [
    'avataaars',
    'big-smile',
    'bottts',
    'identicon',
    'initials',
    'lorelei',
    'micah',
    'miniavs',
    'pixel-art',
    'thumbs'
]

const avatars = ref<Avatar[]>([])
const selectedAvatar = ref<Avatar | null>(null)
const isDialogOpen = ref(false)

const generateRandomSeed = () => {
    return Math.random().toString(36).substring(2, 15)
}

const openAvatarSelection = () => {
    if (avatars.value.length === 0) {
        generateAvatars()
    }
    isDialogOpen.value = true
}

const confirmSelection = () => {
    if (selectedAvatar.value) {
        emit('update:modelValue', selectedAvatar.value.url)
    }
    isDialogOpen.value = false
}

const generateAvatars = () => {
    const newAvatars: Avatar[] = []
    const maxAvatars = 20

    const avatarsPerStyle = Math.ceil(maxAvatars / avatarStyles.length)

    avatarStyles.forEach(style => {
        for (let i = 0; i < avatarsPerStyle && newAvatars.length < maxAvatars; i++) {
            const seed = generateRandomSeed()
            newAvatars.push({
                url: `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`,
                style: style,
                seed: seed
            })
        }
    })

    avatars.value = newAvatars.sort(() => Math.random() - 0.5)
}

const selectAvatar = (avatar: Avatar) => {
    selectedAvatar.value = avatar
}

onMounted(() => {
    if (props.modelValue) {
        selectedAvatar.value = {
            url: props.modelValue,
            style: 'unknown',
            seed: 'unknown'
        }
    }
})

watch(() => props.modelValue, (newValue) => {
    if (newValue && selectedAvatar.value?.url !== newValue) {
        selectedAvatar.value = {
            url: newValue,
            style: 'unknown',
            seed: 'unknown'
        }
    } else if (!newValue) {
        selectedAvatar.value = null
    }
})
</script>
