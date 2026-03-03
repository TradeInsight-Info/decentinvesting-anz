/**
 * Pure financial calculation functions used by interactive components.
 * All functions are deterministic with no side effects.
 */

/** Compound growth with regular contributions, returning yearly snapshots. */
export function compoundGrowth(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number,
): { year: number; balance: number }[] {
  const monthlyRate = annualRate / 12;
  const results: { year: number; balance: number }[] = [{ year: 0, balance: principal }];
  let balance = principal;

  for (let month = 1; month <= years * 12; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    if (month % 12 === 0) {
      results.push({ year: month / 12, balance: Math.round(balance * 100) / 100 });
    }
  }

  return results;
}

/** Impact of expense ratio on a portfolio over time. */
export function feeImpact(
  principal: number,
  annualReturn: number,
  years: number,
  expenseRatioA: number,
  expenseRatioB: number,
): { year: number; valueA: number; valueB: number }[] {
  const results: { year: number; valueA: number; valueB: number }[] = [];
  let balanceA = principal;
  let balanceB = principal;

  for (let y = 0; y <= years; y++) {
    results.push({
      year: y,
      valueA: Math.round(balanceA),
      valueB: Math.round(balanceB),
    });
    balanceA *= 1 + (annualReturn - expenseRatioA);
    balanceB *= 1 + (annualReturn - expenseRatioB);
  }

  return results;
}

/** Emergency fund tiers with blended yield calculation. */
export function emergencyFundTiers(
  monthlyExpenses: number,
  months: number,
): {
  tiers: { name: string; months: number; amount: number; rate: number }[];
  total: number;
  blendedYield: number;
  annualInterest: number;
} {
  const total = monthlyExpenses * months;

  const tier1Months = Math.min(1, months);
  const tier2Months = Math.min(Math.max(months - 1, 0), 4);
  const tier3Months = Math.max(months - 5, 0);

  const tiers = [
    { name: 'Checking', months: tier1Months, amount: monthlyExpenses * tier1Months, rate: 0.0001 },
    { name: 'HYSA', months: tier2Months, amount: monthlyExpenses * tier2Months, rate: 0.045 },
    {
      name: 'T-Bills / CDs',
      months: tier3Months,
      amount: monthlyExpenses * tier3Months,
      rate: 0.05,
    },
  ].filter((t) => t.months > 0);

  const weightedRate = tiers.reduce((sum, t) => sum + t.amount * t.rate, 0) / total;
  const annualInterest = total * weightedRate;

  return {
    tiers,
    total: Math.round(total),
    blendedYield: Math.round(weightedRate * 10000) / 100,
    annualInterest: Math.round(annualInterest),
  };
}

/** Debt payoff simulation for avalanche or snowball method. */
export function debtPayoff(
  debts: { name: string; balance: number; rate: number; minimum: number }[],
  extraPayment: number,
  method: 'avalanche' | 'snowball',
): {
  months: number;
  totalInterest: number;
} {
  const working = debts.map((d) => ({ ...d, remaining: d.balance }));
  const sorted =
    method === 'avalanche'
      ? [...working].sort((a, b) => b.rate - a.rate)
      : [...working].sort((a, b) => a.remaining - b.remaining);

  let totalInterest = 0;
  let month = 0;

  while (sorted.some((d) => d.remaining > 0) && month < 600) {
    month++;
    let extra = extraPayment;
    const target = sorted.find((d) => d.remaining > 0);

    for (const debt of sorted) {
      if (debt.remaining <= 0) continue;
      const interest = (debt.remaining * debt.rate) / 12;
      totalInterest += interest;
      debt.remaining += interest;

      const payment = Math.min(
        debt.remaining,
        debt.minimum + (debt === target ? extra : 0),
      );
      debt.remaining -= payment;

      if (debt === target) {
        extra = Math.max(0, extra - (payment - debt.minimum));
      }

      if (debt.remaining <= 0.01) {
        debt.remaining = 0;
        extra += debt.minimum;
      }
    }
  }

  return {
    months: month,
    totalInterest: Math.round(totalInterest),
  };
}

/** Portfolio allocation suggestion based on age and risk tolerance. */
export function suggestAllocation(
  age: number,
  riskTolerance: number, // 0-100 scale
): { stocks: number; bonds: number; usStocks: number; intlStocks: number } {
  // Base: 110 - age = equity %
  const baseEquity = Math.max(20, Math.min(95, 110 - age));

  // Adjust by risk tolerance (±15 percentage points)
  const riskAdjustment = ((riskTolerance - 50) / 50) * 15;
  const stocks = Math.round(Math.max(20, Math.min(95, baseEquity + riskAdjustment)));
  const bonds = 100 - stocks;

  // US/Intl split: ~60/40 by global market cap
  const usStocks = Math.round(stocks * 0.6);
  const intlStocks = stocks - usStocks;

  return { stocks, bonds, usStocks, intlStocks };
}

/** Roth vs Traditional comparison — simplified. */
export function rothVsTraditional(
  annualContribution: number,
  currentTaxRate: number,
  futureTaxRate: number,
  annualReturn: number,
  years: number,
): { rothFinal: number; traditionalFinal: number; rothAdvantage: number } {
  // Roth: contribute after-tax, grow tax-free
  // Traditional: contribute pre-tax, grow tax-deferred, pay tax on withdrawal
  const rothContribution = annualContribution * (1 - currentTaxRate);
  let rothBalance = 0;
  let tradBalance = 0;
  for (let y = 0; y < years; y++) {
    rothBalance = (rothBalance + rothContribution) * (1 + annualReturn);
    tradBalance = (tradBalance + annualContribution) * (1 + annualReturn);
  }
  const tradAfterTax = tradBalance * (1 - futureTaxRate);

  return {
    rothFinal: Math.round(rothBalance),
    traditionalFinal: Math.round(tradAfterTax),
    rothAdvantage: Math.round(rothBalance - tradAfterTax),
  };
}
