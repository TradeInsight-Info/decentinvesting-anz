import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, test } from 'vitest';
import { initCountryTabs } from '@/lib/country-tabs';
import countryTabsCss from '@/styles/country-tabs.css?raw';
import CountryTabs from './CountryTabs.astro';

let page: JSDOM;

beforeEach(() => {
  page = new JSDOM(`<!doctype html><head><style>${countryTabsCss}</style></head><body></body>`, {
    url: 'https://decentinvesting-anz.tradeinsight.info/guide/3-investment-accounts',
  });
  const { window } = page;
  Object.assign(globalThis, {
    window,
    document: window.document,
    localStorage: window.localStorage,
  });
});

async function openPage(...groups: { au: string; nz: string }[]) {
  const container = await AstroContainer.create();
  const sections = await Promise.all(
    groups.map(({ au, nz }) =>
      container.renderToString(CountryTabs, {
        slots: { au: `<p>${au}</p>`, nz: `<p>${nz}</p>` },
      }),
    ),
  );
  const { document } = page.window;
  delete document.documentElement.dataset.country;
  document.body.innerHTML = sections.map((html) => `<section>${html}</section>`).join('');
  initCountryTabs();
  return within(document.body);
}

function isShown(element: Element) {
  for (let node: Element | null = element; node; node = node.parentElement) {
    if (node.hasAttribute('hidden') || page.window.getComputedStyle(node).display === 'none') {
      return false;
    }
  }
  return true;
}

describe('CountryTabs', () => {
  test('shows Australia first', async () => {
    const screen = await openPage({ au: 'Super guarantee', nz: 'KiwiSaver rates' });

    expect(isShown(screen.getByText('Super guarantee'))).toBe(true);
    expect(isShown(screen.getByText('KiwiSaver rates'))).toBe(false);
    expect(screen.getByRole('button', { name: 'Australia', pressed: true })).toBeTruthy();
    expect(isShown(screen.getByText('Reading from New Zealand? Choose New Zealand above.'))).toBe(
      true,
    );
  });

  test('picking New Zealand switches every tab group on the page', async () => {
    const screen = await openPage(
      { au: 'Super guarantee', nz: 'KiwiSaver rates' },
      { au: 'VGS', nz: 'Smart Total World' },
    );
    const [, secondGroup] = screen.getAllByRole('group', { name: 'Country' });

    await userEvent.click(within(secondGroup).getByRole('button', { name: 'New Zealand' }));

    expect(isShown(screen.getByText('KiwiSaver rates'))).toBe(true);
    expect(isShown(screen.getByText('Smart Total World'))).toBe(true);
    expect(isShown(screen.getByText('Super guarantee'))).toBe(false);
    expect(isShown(screen.getByText('VGS'))).toBe(false);
    expect(screen.getAllByRole('button', { name: 'New Zealand', pressed: true })).toHaveLength(2);
  });

  test('a find-in-page match in the hidden country switches to that country', async () => {
    const screen = await openPage({ au: 'Super guarantee', nz: 'KiwiSaver rates' });
    const match = screen.getByText('KiwiSaver rates');

    match
      .closest('[hidden]')
      ?.dispatchEvent(new page.window.Event('beforematch', { bubbles: true }));

    expect(isShown(match)).toBe(true);
    expect(isShown(screen.getByText('Super guarantee'))).toBe(false);
    expect(screen.getByRole('button', { name: 'New Zealand', pressed: true })).toBeTruthy();
  });

  test('remembers the choice on the next page', async () => {
    const firstPage = await openPage({ au: 'Super guarantee', nz: 'KiwiSaver rates' });
    await userEvent.click(firstPage.getByRole('button', { name: 'New Zealand' }));

    const nextPage = await openPage({ au: 'HELP repayments', nz: 'NZ student loan' });

    expect(isShown(nextPage.getByText('NZ student loan'))).toBe(true);
    expect(isShown(nextPage.getByText('HELP repayments'))).toBe(false);
  });
});
