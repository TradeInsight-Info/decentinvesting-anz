import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import DebtPayoffComparison from './DebtPayoffComparison.svelte';

describe('DebtPayoffComparison', () => {
  test('with $500 extra a month, the avalanche clears the default debts in 23 months for $388 less interest', () => {
    render(DebtPayoffComparison);

    expect(screen.getAllByText('23 months')).toHaveLength(2);
    expect(screen.getByText('$2,401')).toBeTruthy();
    expect(screen.getByText('$2,789')).toBeTruthy();
    expect(screen.getByText(/Avalanche saves/).textContent).toContain('$388');
  });
});
