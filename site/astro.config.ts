import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: process.env.CI
    ? 'https://replit-clone.vercel.app'
    : 'http://localhost:4321',

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: "server",
  adapter: node({
    mode: 'standalone'
  })
})