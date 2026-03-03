/** Contribution limits and tax thresholds. Verify at irs.gov for current year. */

export const TAX_YEAR = 2025;

export const CONTRIBUTION_LIMITS = {
  '401k': { under50: 23_500, over50: 31_000 },
  ira: { under50: 7_000, over50: 8_000 },
  hsa: { individual: 4_300, family: 8_550, catchUp55: 1_000 },
} as const;

export const ROTH_IRA_INCOME_LIMITS = {
  single: { phaseOutStart: 150_000, phaseOutEnd: 165_000 },
  marriedFilingJointly: { phaseOutStart: 236_000, phaseOutEnd: 246_000 },
} as const;

export const FUND_EXAMPLES = {
  totalWorld: { ticker: 'VT', name: 'Vanguard Total World Stock ETF', er: 0.0007 },
  totalUS: { ticker: 'VTI', name: 'Vanguard Total Stock Market ETF', er: 0.0003 },
  totalIntl: { ticker: 'VXUS', name: 'Vanguard Total International Stock ETF', er: 0.0007 },
  totalBond: { ticker: 'BND', name: 'Vanguard Total Bond Market ETF', er: 0.0003 },
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
