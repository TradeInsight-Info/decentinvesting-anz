type Country = 'au' | 'nz';

const STORAGE_KEY = 'country';

function showCountry(country: Country): void {
  document.documentElement.dataset.country = country;
  for (const tab of document.querySelectorAll<HTMLElement>('[data-country-tab]')) {
    tab.setAttribute('aria-pressed', String(tab.dataset.countryTab === country));
  }
  for (const panel of document.querySelectorAll<HTMLElement>('[data-country-panel]')) {
    if (panel.dataset.countryPanel === country) panel.removeAttribute('hidden');
    else panel.setAttribute('hidden', 'until-found');
  }
}

function chooseCountry(country: Country): void {
  localStorage.setItem(STORAGE_KEY, country);
  showCountry(country);
}

export function initCountryTabs(): void {
  showCountry(localStorage.getItem(STORAGE_KEY) === 'nz' ? 'nz' : 'au');

  for (const tab of document.querySelectorAll<HTMLElement>('[data-country-tab]')) {
    tab.addEventListener('click', () => {
      const topBefore = tab.getBoundingClientRect().top;
      chooseCountry(tab.dataset.countryTab as Country);
      const shift = tab.getBoundingClientRect().top - topBefore;
      if (shift) window.scrollBy(0, shift);
    });
  }

  for (const panel of document.querySelectorAll<HTMLElement>('[data-country-panel]')) {
    panel.addEventListener('beforematch', () =>
      chooseCountry(panel.dataset.countryPanel as Country),
    );
  }
}
