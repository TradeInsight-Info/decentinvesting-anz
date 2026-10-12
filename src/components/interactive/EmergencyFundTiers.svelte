<script lang="ts">
  import { emergencyFundTiers } from '@/lib/calculations';
  import { EXAMPLE_CASH_RATES } from '@/lib/constants';
  import CurrencyInput from '@/components/ui/CurrencyInput.svelte';

  let monthlyExpenses = $state(4500);
  let months = $state(6);

  const result = $derived(emergencyFundTiers(monthlyExpenses, months));

  const tierColors = [
    'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700',
    'bg-sage-100 dark:bg-sage-900/40 border-sage-300 dark:border-sage-700',
    'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700',
  ];
</script>

<div
  class="my-8 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900"
>
  <h4 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Emergency Fund Tiers</h4>

  <div class="mb-6 grid max-w-md grid-cols-2 gap-4">
    <CurrencyInput bind:value={monthlyExpenses} label="Monthly expenses" min={500} step={500} />
    <label class="block">
      <span class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
        >Months of coverage</span
      >
      <input
        type="range"
        bind:value={months}
        min="1"
        max="12"
        class="mt-2 w-full accent-sage-600 dark:accent-sage-400"
      />
      <span class="text-xs text-gray-500 dark:text-gray-400">{months} months</span>
    </label>
  </div>

  <!-- Tiered bar visualization -->
  <div class="mb-4" role="img" aria-label="Emergency fund tier allocation">
    <!-- Labels above the bar -->
    <div class="mb-1 flex gap-1">
      {#each result.tiers as tier, i}
        {@const widthPct = (tier.amount / result.total) * 100}
        <div class="min-w-0 text-center transition-all duration-300" style="width: {widthPct}%">
          <span class="block truncate px-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
            {tier.name}
          </span>
          <span class="block truncate px-0.5 text-xs text-gray-500 dark:text-gray-400">
            ${tier.amount.toLocaleString()}
          </span>
        </div>
      {/each}
    </div>
    <!-- Bar segments -->
    <div class="flex h-10 gap-1 overflow-hidden rounded-lg">
      {#each result.tiers as tier, i}
        {@const widthPct = (tier.amount / result.total) * 100}
        <div
          class="border {tierColors[i]} rounded transition-all duration-300"
          style="width: {widthPct}%"
          title="{tier.name}: ${tier.amount.toLocaleString()} ({tier.months} mo)"
        ></div>
      {/each}
    </div>
  </div>

  <!-- Tier details table -->
  <table class="mb-4 w-full text-sm">
    <thead>
      <tr>
        <th class="text-left">Tier</th>
        <th class="text-left">Where</th>
        <th class="text-right">Months</th>
        <th class="text-right">Amount</th>
        <th class="text-right">Example rate ({EXAMPLE_CASH_RATES.asAt})</th>
      </tr>
    </thead>
    <tbody>
      {#each result.tiers as tier, i}
        <tr>
          <td>{i + 1}</td>
          <td>{tier.name}</td>
          <td class="text-right">{tier.months}</td>
          <td class="text-right">${tier.amount.toLocaleString()}</td>
          <td class="text-right">{(tier.rate * 100).toFixed(2)}%</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="grid grid-cols-3 gap-4 text-center">
    <div>
      <p class="text-xs text-gray-500 dark:text-gray-400">Total fund</p>
      <p class="text-lg font-bold text-gray-700 dark:text-gray-200">
        ${result.total.toLocaleString()}
      </p>
    </div>
    <div>
      <p class="text-xs text-gray-500 dark:text-gray-400">Blended rate (example)</p>
      <p class="text-lg font-bold text-sage-600 dark:text-sage-400">{result.blendedYield}%</p>
    </div>
    <div>
      <p class="text-xs text-gray-500 dark:text-gray-400">Annual interest</p>
      <p class="text-lg font-bold text-sage-700 dark:text-sage-300">
        ${result.annualInterest.toLocaleString()}
      </p>
    </div>
  </div>
</div>
