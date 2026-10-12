/** Australian tax and super settings. Verify at ato.gov.au each financial year (1 July). */

export const AU_FINANCIAL_YEAR = '2026-27';

export const AU_RESIDENT_TAX_BRACKETS = [
  { from: 0, rate: 0 },
  { from: 18_200, rate: 0.15 },
  { from: 45_000, rate: 0.3 },
  { from: 135_000, rate: 0.37 },
  { from: 190_000, rate: 0.45 },
] as const;

export const AU_MEDICARE_LEVY = 0.02;

export const AU_LOW_INCOME_TAX_OFFSET = {
  max: 700,
  firstTaperFrom: 37_500,
  firstTaperRate: 0.05,
  secondTaperFrom: 45_000,
  secondTaperRate: 0.015,
} as const;

export const AU_SUPER = {
  guaranteeRate: 0.12,
  maximumContributionBase: 270_830,
  concessionalCap: 32_500,
  contributionsTax: 0.15,
  division293Threshold: 250_000,
  lowIncomeOffsetMax: 500,
  lowIncomeOffsetIncomeLimit: 37_000,
} as const;

export const EXAMPLE_CASH_RATES = {
  asAt: 'Oct 2026',
  onlineSaver: 0.04,
  termDeposit: 0.0425,
} as const;

export const MARKET_DRAWDOWNS = [
  { name: 'Oil Crisis', year: 1973, drop: -48, recovery: 1980 },
  { name: 'Black Monday', year: 1987, drop: -34, recovery: 1989 },
  { name: 'Dot-com', year: 2000, drop: -49, recovery: 2007 },
  { name: '2008 Crisis', year: 2007, drop: -57, recovery: 2013 },
  { name: 'COVID', year: 2020, drop: -34, recovery: 2020 },
] as const;

export const GUIDE_PAGES = [
  { slug: '0-before-you-start', title: 'Before You Start', number: 0 },
  { slug: '1-cash-cushion', title: 'Cash Cushion', number: 1 },
  { slug: '2-tackle-debt', title: 'Tackle Debt', number: 2 },
  { slug: '3-investment-accounts', title: 'Investment Accounts', number: 3 },
  { slug: '4-investment-choices', title: 'Investment Choices', number: 4 },
  { slug: '5-staying-the-course', title: 'Staying the Course', number: 5 },
  { slug: '6-next-steps', title: 'Next Steps', number: 6 },
] as const;
