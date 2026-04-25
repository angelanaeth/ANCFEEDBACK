import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import { writeFileSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  plugins: [
    build(),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    }),
    {
      name: 'custom-routes',
      writeBundle() {
        // Write custom _routes.json
        // Root and specific redirects go to worker
        // All /static/*.html files served directly by Pages
        const routesPath = join(process.cwd(), 'dist', '_routes.json')
        const routes = {
          version: 1,
          include: ['/', '/api/*', '/auth/*', '/handle_*', '/login', '/logout'],
          exclude: ['/static/*']
        }
        writeFileSync(routesPath, JSON.stringify(routes))
        console.log('✅ Custom _routes.json written (root + API + auth to worker, all static to Pages)')
      }
    }
  ]
})
