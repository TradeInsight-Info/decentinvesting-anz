import { getViteConfig } from 'astro/config';
import { svelteTesting } from '@testing-library/svelte/vite';

export default getViteConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [svelteTesting()],
        test: {
          name: 'svelte',
          environment: 'jsdom',
          include: ['src/**/*.test.ts'],
          exclude: ['src/**/*.astro.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'astro',
          environment: 'node',
          include: ['src/**/*.astro.test.ts'],
        },
      },
    ],
  },
});
