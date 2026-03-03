/**
 * Shared utilities for D3 chart components.
 * Eliminates duplicated isDark(), theme colors, observer setup, and axis styling.
 */
import type { Selection } from 'd3';

export function isDark(): boolean {
  return document.documentElement.classList.contains('dark');
}

export function chartTheme(dark: boolean) {
  return {
    axis: dark ? '#4b5563' : '#e5e7eb',
    tick: dark ? '#9ca3af' : '#6b7280',
    label: dark ? '#9ca3af' : '#6b7280',
    text: dark ? '#f3f4f6' : '#1f2937',
    green: dark ? '#6aad7a' : '#4a7c59',
    greenMuted: '#a8c2af',
    red: dark ? '#f87171' : '#ef4444',
    pieBorder: dark ? '#030712' : 'white',
  } as const;
}

/** Style a D3 axis group (domain line + tick marks + tick labels). */
export function styleAxis(
  sel: Selection<SVGGElement, unknown, null, undefined>,
  colors: { axis: string; tick: string },
): void {
  sel.select('.domain').attr('stroke', colors.axis);
  sel.selectAll('.tick text').attr('fill', colors.tick);
  sel.selectAll('.tick line').attr('stroke', colors.axis);
}

/**
 * Set up ResizeObserver + MutationObserver for chart components.
 * - ResizeObserver: debounced via rAF to avoid jank during window resize
 * - MutationObserver: watches dark mode class changes on <html>
 * Returns a cleanup function to disconnect both observers.
 */
export function setupChartObservers(
  container: HTMLElement,
  onResize: (width: number) => void,
  onThemeChange: () => void,
): () => void {
  let rafId = 0;
  const resizeObs = new ResizeObserver((entries) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      onResize(entries[0].contentRect.width);
    });
  });
  resizeObs.observe(container);

  const themeObs = new MutationObserver(() => {
    onThemeChange();
  });
  themeObs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  return () => {
    cancelAnimationFrame(rafId);
    resizeObs.disconnect();
    themeObs.disconnect();
  };
}
