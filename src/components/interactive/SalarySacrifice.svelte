<script lang="ts">
  import { salarySacrificeComparison } from '@/lib/calculations';
  import { AU_FINANCIAL_YEAR, AU_SUPER } from '@/lib/constants';
  import CurrencyInput from '@/components/ui/CurrencyInput.svelte';

  let salary = $state(90000);
  let sacrifice = $state(5000);

  const result = $derived(salarySacrificeComparison(salary, sacrifice));
  const largest = $derived(Math.max(result.intoSuperIfSacrificed, result.takeHomeIfPaid, 1));
</script>

<div
  class="my-8 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900"
>
  <h4 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
    Salary Sacrifice vs Take-Home Pay (Australia, {AU_FINANCIAL_YEAR})
  </h4>

  <div class="mb-6 grid max-w-md grid-cols-2 gap-4">
    <CurrencyInput bind:value={salary} label="Yearly salary (before tax)" step={5000} />
    <CurrencyInput bind:value={sacrifice} label="Amount to salary sacrifice" step={500} />
  </div>

  <div class="mb-4 space-y-3">
    <div>
      <div class="mb-1 flex justify-between text-sm">
        <span class="font-medium text-sage-700 dark:text-sage-300">Into super if sacrificed</span>
        <span class="font-bold text-gray-900 dark:text-gray-100"
          >${result.intoSuperIfSacrificed.toLocaleString()}</span
        >
      </div>
      <div class="h-6 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          class="h-full rounded-full bg-sage-500 transition-all duration-500 dark:bg-sage-400"
          style="width: {(result.intoSuperIfSacrificed / largest) * 100}%"
        ></div>
      </div>
    </div>
    <div>
      <div class="mb-1 flex justify-between text-sm">
        <span class="font-medium text-blue-700 dark:text-blue-300">In your pocket if paid</span>
        <span class="font-bold text-gray-900 dark:text-gray-100"
          >${result.takeHomeIfPaid.toLocaleString()}</span
        >
      </div>
      <div class="h-6 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          class="h-full rounded-full bg-blue-500 transition-all duration-500 dark:bg-blue-400"
          style="width: {(Math.max(result.takeHomeIfPaid, 0) / largest) * 100}%"
        ></div>
      </div>
    </div>
  </div>

  <div
    class="rounded-lg p-3 text-center text-sm {result.sacrificeAdvantage > 0
      ? 'bg-sage-50 text-sage-700 dark:bg-sage-950/40 dark:text-sage-300'
      : 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'}"
  >
    {#if result.sacrificeAdvantage > 0}
      Salary sacrificing puts <strong>${result.sacrificeAdvantage.toLocaleString()}</strong> more to work
      each year, but it stays in super until you can access it.
    {:else}
      At this income, taking the money as pay leaves you
      <strong>${Math.abs(result.sacrificeAdvantage).toLocaleString()}</strong> better off than salary
      sacrificing.
    {/if}
  </div>

  {#if result.lowIncomeOffset > 0}
    <p class="mt-3 text-sm text-sage-700 dark:text-sage-300">
      Includes ${result.lowIncomeOffset.toLocaleString()} extra from the Low Income Super Tax Offset,
      which refunds the 15% tax on super contributions, up to ${AU_SUPER.lowIncomeOffsetMax.toLocaleString()}
      ({AU_FINANCIAL_YEAR}), if your income is ${AU_SUPER.lowIncomeOffsetIncomeLimit.toLocaleString()}
      or less ({AU_FINANCIAL_YEAR}).
    </p>
  {/if}

  {#if result.overCap}
    <p role="alert" class="mt-3 text-sm font-medium text-amber-700 dark:text-amber-300">
      Your employer's {AU_SUPER.guaranteeRate * 100}% ({AU_FINANCIAL_YEAR}) super plus this
      sacrifice comes to ${result.concessionalTotal.toLocaleString()}, over the ${AU_SUPER.concessionalCap.toLocaleString()}
      ({AU_FINANCIAL_YEAR}) concessional cap. Amounts over the cap are taxed at your marginal rate,
      unless you have unused cap from earlier years to carry forward.
    </p>
  {/if}

  {#if result.division293Risk}
    <p role="alert" class="mt-3 text-sm font-medium text-amber-700 dark:text-amber-300">
      Your income plus super contributions is over ${AU_SUPER.division293Threshold.toLocaleString()} ({AU_FINANCIAL_YEAR}),
      so Division 293 tax adds another 15% ({AU_FINANCIAL_YEAR}) on some contributions. This
      calculator doesn't include it.
    </p>
  {/if}

  <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">
    Simplified: compares {AU_SUPER.contributionsTax * 100}% ({AU_FINANCIAL_YEAR}) contributions tax
    with your marginal tax rate ({AU_FINANCIAL_YEAR}) plus the 2% Medicare levy ({AU_FINANCIAL_YEAR}).
    It includes the Low Income Tax Offset and the Low Income Super Tax Offset ({AU_FINANCIAL_YEAR}),
    but ignores Medicare levy reductions for low incomes and HELP repayments. Rates are for Australian residents. Check
    ato.gov.au, or ask a registered tax agent.
  </p>
</div>
