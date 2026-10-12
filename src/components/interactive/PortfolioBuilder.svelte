<script lang="ts">
  import { suggestAllocation } from '@/lib/calculations';
  import AllocationPie from '@/components/visualizations/AllocationPie.svelte';

  let age = $state(30);
  let riskTolerance = $state(50);

  const allocation = $derived(suggestAllocation(age, riskTolerance));

  const riskLabel = $derived(
    riskTolerance < 30 ? 'Conservative' : riskTolerance < 70 ? 'Moderate' : 'Aggressive',
  );

  const slices = $derived([
    {
      label: 'Stocks (global, including your home market)',
      value: allocation.stocks,
      color: '#4a7c59',
    },
    { label: 'Bonds', value: allocation.bonds, color: '#a8c2af' },
  ]);
</script>

<div
  class="my-8 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900"
>
  <h4 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Portfolio Builder</h4>

  <div class="mb-6 grid max-w-md grid-cols-2 gap-6">
    <label class="block">
      <span class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Your age</span>
      <input
        type="range"
        bind:value={age}
        min="18"
        max="80"
        class="w-full accent-sage-600 dark:accent-sage-400"
      />
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{age} years old</span>
    </label>
    <label class="block">
      <span class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
        >Risk tolerance</span
      >
      <input
        type="range"
        bind:value={riskTolerance}
        min="0"
        max="100"
        class="w-full accent-sage-600 dark:accent-sage-400"
      />
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{riskLabel}</span>
    </label>
  </div>

  <div class="flex flex-col items-center gap-6 sm:flex-row">
    <div class="h-48 w-48">
      <AllocationPie {slices} />
    </div>

    <div class="flex-1 space-y-2">
      {#each slices as slice}
        <div class="flex items-center gap-3">
          <span class="h-3 w-3 shrink-0 rounded-full" style="background-color: {slice.color}"
          ></span>
          <span class="flex-1 text-sm text-gray-700 dark:text-gray-300">{slice.label}</span>
          <span class="text-sm font-bold text-gray-900 dark:text-gray-100">{slice.value}%</span>
        </div>
      {/each}
    </div>
  </div>

  <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
    Based on the "110 minus age" rule, adjusted for risk tolerance. See the fund examples below for
    low-cost ways to hold each part in Australia or New Zealand.
  </p>
</div>
