/**
 * Pure financial calculation functions used by interactive components.
 * All functions are deterministic with no side effects.
 */

import { AU_MEDICARE_LEVY, AU_RESIDENT_TAX_BRACKETS, AU_SUPER } from '@/lib/constants';

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
    {
      name: 'Everyday account',
      months: tier1Months,
      amount: monthlyExpenses * tier1Months,
      rate: 0,
    },
    {
      name: 'Online or bonus saver',
      months: tier2Months,
      amount: monthlyExpenses * tier2Months,
      rate: 0.04,
    },
    {
      name: 'Term deposits',
      months: tier3Months,
      amount: monthlyExpenses * tier3Months,
      rate: 0.0425,
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

  const monthlyBudget = debts.reduce((sum, d) => sum + d.minimum, 0) + extraPayment;
  let totalInterest = 0;
  let month = 0;

  while (sorted.some((d) => d.remaining > 0) && month < 600) {
    month++;
    const open = sorted.filter((d) => d.remaining > 0);

    for (const debt of open) {
      const interest = (debt.remaining * debt.rate) / 12;
      totalInterest += interest;
      debt.remaining += interest;
    }

    let leftover = monthlyBudget;
    for (const debt of open) {
      const payment = Math.min(debt.remaining, debt.minimum);
      debt.remaining -= payment;
      leftover -= payment;
    }

    for (const debt of open) {
      const payment = Math.min(debt.remaining, leftover);
      debt.remaining -= payment;
      leftover -= payment;
      if (debt.remaining <= 0.01) debt.remaining = 0;
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
): { stocks: number; bonds: number } {
  // Base: 110 - age = equity %
  const baseEquity = Math.max(20, Math.min(95, 110 - age));

  // Adjust by risk tolerance (±15 percentage points)
  const riskAdjustment = ((riskTolerance - 50) / 50) * 15;
  const stocks = Math.round(Math.max(20, Math.min(95, baseEquity + riskAdjustment)));
  const bonds = 100 - stocks;

  return { stocks, bonds };
}

/** Income tax plus Medicare levy for an Australian resident (low-income levy reductions ignored). */
export function australianIncomeTax(taxableIncome: number): number {
  let tax = 0;
  for (let i = 0; i < AU_RESIDENT_TAX_BRACKETS.length; i++) {
    const { from, rate } = AU_RESIDENT_TAX_BRACKETS[i];
    const to = AU_RESIDENT_TAX_BRACKETS[i + 1]?.from ?? Infinity;
    tax += Math.max(0, Math.min(taxableIncome, to) - from) * rate;
  }
  return tax + Math.max(0, taxableIncome) * AU_MEDICARE_LEVY;
}

/** Low Income Super Tax Offset: refunds the 15% contributions tax, capped, for low incomes. */
function lowIncomeSuperTaxOffset(adjustedTaxableIncome: number, concessional: number): number {
  if (adjustedTaxableIncome > AU_SUPER.lowIncomeOffsetIncomeLimit) return 0;
  return Math.min(AU_SUPER.lowIncomeOffsetMax, concessional * AU_SUPER.contributionsTax);
}

/** Salary sacrifice into super vs taking the same amount as pay, for one year. */
export function salarySacrificeComparison(
  salary: number,
  sacrifice: number,
): {
  takeHomeIfPaid: number;
  intoSuperIfSacrificed: number;
  lowIncomeOffset: number;
  sacrificeAdvantage: number;
  concessionalTotal: number;
  overCap: boolean;
  division293Risk: boolean;
} {
  const takeHomeIfPaid =
    sacrifice - (australianIncomeTax(salary) - australianIncomeTax(salary - sacrifice));
  const employerSuper = salary * AU_SUPER.guaranteeRate;
  const concessionalTotal = employerSuper + sacrifice;
  const lowIncomeOffset =
    lowIncomeSuperTaxOffset(salary, concessionalTotal) -
    lowIncomeSuperTaxOffset(salary, employerSuper);
  const intoSuperIfSacrificed = sacrifice * (1 - AU_SUPER.contributionsTax) + lowIncomeOffset;

  return {
    takeHomeIfPaid: Math.round(takeHomeIfPaid),
    intoSuperIfSacrificed: Math.round(intoSuperIfSacrificed),
    lowIncomeOffset: Math.round(lowIncomeOffset),
    sacrificeAdvantage: Math.round(intoSuperIfSacrificed - takeHomeIfPaid),
    concessionalTotal: Math.round(concessionalTotal),
    overCap: concessionalTotal > AU_SUPER.concessionalCap,
    division293Risk: salary + salary * AU_SUPER.guaranteeRate > AU_SUPER.division293Threshold,
  };
}
