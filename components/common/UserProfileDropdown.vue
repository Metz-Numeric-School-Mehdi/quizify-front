<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="relative h-10 w-10 rounded-full">
                <Avatar class="h-10 w-10">
                    <AvatarImage :src="userAvatar" :alt="userDisplayName" />
                    <AvatarFallback
                        class="font-semibold bg-white text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-purple-500">
                        {{ userInitials }}
                    </AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" align="end" :side-offset="5">
            <DropdownMenuLabel class="flex flex-col space-y-1">
                <p class="text-sm font-medium leading-none">{{ userDisplayName }}</p>
                <p class="text-xs leading-none text-muted-foreground">@{{ useAuth.state.user?.username }}</p>
                <p v-if="subscriptionPlan" class="text-xs leading-none text-purple-600 font-medium">
                    {{ subscriptionPlan }}
                </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
                <DropdownMenuItem :disabled="!useAuth.state.isAuthenticated" @click="navigateToProfile"
                    :class="{ 'opacity-50 cursor-not-allowed': !useAuth.state.isAuthenticated }">
                    <Icon name="User" class="mr-2 h-4 w-4" />
                    <span>Voir mon profil</span>
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <template v-if="!useAuth.state.isAuthenticated">
                <DropdownMenuItem @click="navigateToLogin">
                    <Icon name="LogIn" class="mr-2 h-4 w-4" />
                    <span>Se connecter</span>
                </DropdownMenuItem>
            </template>

            <template v-else>
                <DropdownMenuItem @click="handleSignOut" class="text-red-600 focus:text-red-600">
                    <Icon name="LogOut" class="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                </DropdownMenuItem>
            </template>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import Icon from '@/components/Icon.vue';
import { authStore } from '@/stores/authStore';

const useAuth = authStore();
const router = useRouter();

const userDisplayName = computed(() => {
    if (!useAuth.state.user) return 'Utilisateur';

    const { firstname, lastname, username } = useAuth.state.user;

    if (firstname && lastname) {
        return `${firstname} ${lastname}`;
    }

    return username || 'Utilisateur';
});

const userInitials = computed(() => {
    if (!useAuth.state.user) return 'U';

    const { firstname, lastname, username } = useAuth.state.user;

    if (firstname && lastname) {
        return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
    }

    if (username) {
        return username.substring(0, 2).toUpperCase();
    }

    return 'U';
});

const userAvatar = computed(() => {
    if (useAuth.state.user?.avatar) {
        return useAuth.state.user.avatar;
    }
});

const subscriptionPlan = computed(() => {
    const plan = useAuth.state.user?.subscription_plan?.name;
    return plan && plan !== 'Gratuit' ? plan : '';
});

const navigateToProfile = () => {
    if (useAuth.state.isAuthenticated) {
        router.push('/profile');
    }
};

const navigateToLogin = () => {
    router.push('/login');
};

const handleSignOut = () => {
    useAuth.signOut();
};
</script>
