import { fireEvent, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import CompoundingCalculator from './CompoundingCalculator.svelte';

vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    disconnect() {}
  },
);

describe('CompoundingCalculator', () => {
  test('$10,000 at 8% a year with no contributions grows to $10,800 after one year', async () => {
    render(CompoundingCalculator);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText('Monthly contribution'));
    await new Promise(requestAnimationFrame);
    await user.keyboard('0');
    await user.tab();
    await fireEvent.input(screen.getByLabelText(/Years/), { target: { value: '1' } });

    expect(screen.getByText('Final balance').nextElementSibling?.textContent?.trim()).toBe(
      '$10,800',
    );
  });
});
