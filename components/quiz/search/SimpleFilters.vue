<template>
    <div class="w-full">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
                <Label for="level">Niveau</Label>
                <Select v-model="searchParams.level_id" @update:modelValue="performSearch">
                    <SelectTrigger class="w-full">
                        <SelectValue placeholder="Tous les niveaux" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les niveaux</SelectItem>
                        <SelectItem v-for="level in levels" :key="level.id" :value="level.id.toString()">
                            {{ level.name }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div class="space-y-2">
                <Label for="category">Catégorie</Label>
                <Select v-model="searchParams.category_id" @update:modelValue="performSearch">
                    <SelectTrigger class="w-full">
                        <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        <SelectItem v-for="category in categories" :key="category.id" :value="category.id.toString()">
                            {{ category.name }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div class="flex justify-end mt-4">
            <Button variant="outline" @click="resetFilters">
                <Icon name="RotateCcw" :size="16" />
                Réinitialiser les filtres
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useQuizSearch } from '~/composables/useQuizzesSearch';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '~/components/ui/select';

const props = defineProps({
    initialParams: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['search-result', 'page-change']);

const levels = ref<{ id: number, name: string }[]>([
    { id: 1, name: 'Débutant' },
    { id: 2, name: 'Intermédiaire' },
    { id: 3, name: 'Avancé' },
    { id: 4, name: 'Expert' }
]);

const categories = ref<{ id: number, name: string }[]>([
    { id: 1, name: 'Programmation' },
    { id: 2, name: 'Sciences' },
    { id: 3, name: 'Mathématiques' },
    { id: 4, name: 'Langues' },
    { id: 5, name: 'Histoire' }
]);

const searchParams = ref({
    q: '',
    level_id: '',
    category_id: '',
    page: 1,
    ...props.initialParams
});

const { items, meta, loading, error, search } = useQuizSearch();
const searchTimeout = ref<NodeJS.Timeout | null>(null);

const searchResults = computed(() => {
    return {
        items: items.value,
        meta: meta.value,
        loading: loading.value,
        error: error.value
    };
});

watch(searchResults, (newResults) => {
    emit('search-result', newResults);
}, { deep: true });

onMounted(() => {
    performSearch();
});

const debounceSearch = () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
    }

    searchTimeout.value = setTimeout(() => {
        performSearch();
    }, 500);
};

const performSearch = () => {
    const params = Object.entries(searchParams.value).reduce((acc, [key, value]) => {
        if (
            value !== '' &&
            value !== null &&
            value !== undefined &&
            value !== 'all'
        ) {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, any>);

    search(params);
};

const resetFilters = () => {
    searchParams.value = {
        q: '',
        level_id: 'all',
        category_id: 'all',
        page: 1
    };
    performSearch();
};
</script>
