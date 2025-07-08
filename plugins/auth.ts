import { addRouteMiddleware, defineNuxtPlugin, navigateTo } from '#app'
import { authStore } from '~/stores/authStore'

export default defineNuxtPlugin(async nuxtApp => {
  const store = authStore()
  try {
    await store.verify()
  } catch (error) {
    console.log('Non authentifié')
  }

  addRouteMiddleware(
    'auth',
    async to => {
      if (!to.meta.requiresAuth) return

      const authenticated = store.state.isAuthenticated

      if (!authenticated) {
        try {
          await store.verify()
          if (!store.state.isAuthenticated) {
            return navigateTo('/')
          }
        } catch (error) {
          return navigateTo('/')
        }
      }
    },
    { global: true }
  )
})