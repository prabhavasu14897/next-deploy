import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  plugins: [tsconfigPaths()],
  base: process.env.BASE_PATH || "/next-deploy",
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
  },
});
