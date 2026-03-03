<script lang="ts">
  type Page = { readonly slug: string; readonly title: string; readonly number: number };

  let { pages, currentSlug }: { pages: readonly Page[]; currentSlug: string } = $props();
</script>

<nav class="text-sm" aria-label="Guide navigation">
  <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
    The Guide
  </h3>
  <ul class="space-y-1">
    {#each pages as page}
      <li>
        <a
          href="/guide/{page.slug}"
          class="block rounded-md px-3 py-1.5 no-underline transition-colors
            {currentSlug === page.slug
            ? 'bg-sage-100 font-medium text-sage-700 dark:bg-sage-900/40 dark:text-sage-300'
            : 'text-gray-600 hover:bg-sage-50 hover:text-sage-600 dark:text-gray-400 dark:hover:bg-sage-900/20 dark:hover:text-sage-300'}"
          aria-current={currentSlug === page.slug ? 'page' : undefined}
        >
          {page.number > 0 ? `${page.number}. ` : ''}{page.title}
        </a>
      </li>
    {/each}
  </ul>

  <h3
    class="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100"
  >
    Reference
  </h3>
  <ul class="space-y-1">
    <li>
      <a
        href="/reference/glossary"
        class="block rounded-md px-3 py-1.5 text-gray-600 no-underline transition-colors hover:bg-sage-50 hover:text-sage-600 dark:text-gray-400 dark:hover:bg-sage-900/20 dark:hover:text-sage-300"
      >
        Glossary
      </a>
    </li>
    <li>
      <a
        href="/reference/disclaimer"
        class="block rounded-md px-3 py-1.5 text-gray-600 no-underline transition-colors hover:bg-sage-50 hover:text-sage-600 dark:text-gray-400 dark:hover:bg-sage-900/20 dark:hover:text-sage-300"
      >
        Disclaimer
      </a>
    </li>
  </ul>
</nav>
