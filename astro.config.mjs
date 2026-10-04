import { defineConfig } from 'astro/config';
export default defineConfig({ output: 'static', devToolbar: { enabled: false }, trailingSlash: 'always', vite: { server: { strictPort: true } } });
