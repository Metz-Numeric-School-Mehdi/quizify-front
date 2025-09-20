export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const deferredScripts = [
      'analytics',
      'tracking',
      'social-widgets'
    ]
    
    setTimeout(() => {
      deferredScripts.forEach(script => {
      })
    }, 3000)
  }
})
