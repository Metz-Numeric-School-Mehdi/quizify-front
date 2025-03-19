<template>
  <Tabs default-value="account" class="w-[400px]">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="account"> Se connecter </TabsTrigger>
      <TabsTrigger value="password"> S'inscrire </TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      <Card>
        <CardHeader>
          <CardTitle>Se connecter</CardTitle>
          <CardDescription>
            Renseignez vos informations pour vous connecter à votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-2">
          <SignIn />
        </CardContent>
      </Card>
    </TabsContent>
    <TabsContent value="password">
      <Card>
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription> Renseignez vos informations pour créer un compte. </CardDescription>
        </CardHeader>
        <CardContent class="space-y-2">
          <SignUp />
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignIn from "./SignIn.vue";
import SignUp from "./SignUp.vue";
</script>
