import posthog from 'posthog-js'

// Initialize PostHog with a placeholder key
// Replace 'your-project-api-key' with your actual PostHog API key
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || 'phc_placeholder'

// Only initialize in production
if (import.meta.env.PROD) {
  posthog.init(POSTHOG_KEY, {
    api_host: 'https://app.posthog.com',
    // Enable debug mode in development
    loaded: (posthog) => {
      if (import.meta.env.DEV) posthog.debug()
    }
  })
}

export { posthog } 