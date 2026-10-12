import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import SalarySacrifice from './SalarySacrifice.svelte';

async function setAmount(label: string, amount: number) {
  const user = userEvent.setup();
  await user.click(screen.getByLabelText(label));
  await new Promise(requestAnimationFrame);
  await user.keyboard(String(amount));
  await user.tab();
}

describe('SalarySacrifice', () => {
  test('on a $90,000 salary, sacrificing $5,000 puts $850 more to work than taking it as pay', () => {
    render(SalarySacrifice);

    expect(screen.getByText('$4,250')).toBeTruthy();
    expect(screen.getByText('$3,400')).toBeTruthy();
    expect(screen.getByText('$850')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  test('in the 15% bracket the gain shrinks to the 2% Medicare levy', async () => {
    render(SalarySacrifice);

    await setAmount('Yearly salary (before tax)', 30000);

    expect(screen.getByText('$4,150')).toBeTruthy();
    expect(screen.getByText('$100')).toBeTruthy();
    expect(screen.queryByText(/Low Income Super Tax Offset,/)).toBeNull();
  });

  test('on a $50,000 salary, the Low Income Tax Offset tapering away makes sacrificing $925 better', async () => {
    render(SalarySacrifice);

    await setAmount('Yearly salary (before tax)', 50000);

    expect(screen.getByText('$4,250')).toBeTruthy();
    expect(screen.getByText('$3,325')).toBeTruthy();
    expect(screen.getByText('$925')).toBeTruthy();
  });

  test('on a low income, the Low Income Super Tax Offset adds to super but pay still comes out ahead', async () => {
    render(SalarySacrifice);

    await setAmount('Yearly salary (before tax)', 15000);

    expect(screen.getByText('$4,480')).toBeTruthy();
    expect(
      screen.getByText(/Includes \$230 extra from the Low Income Super Tax Offset/),
    ).toBeTruthy();
    expect(screen.getByText(/taking the money as pay leaves you/)).toBeTruthy();
    expect(screen.getByText('$420')).toBeTruthy();
  });

  test('warns about the concessional cap and Division 293 on a high salary', async () => {
    render(SalarySacrifice);

    await setAmount('Yearly salary (before tax)', 250000);

    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(2);
    expect(alerts[0].textContent?.replace(/\s+/g, ' ')).toContain(
      '$35,000, over the $32,500 (2026-27) concessional cap',
    );
    expect(alerts[1].textContent).toMatch(/Division 293/);
  });
});
