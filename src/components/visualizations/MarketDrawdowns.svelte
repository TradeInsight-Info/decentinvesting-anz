<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { isDark, chartTheme, styleAxis, setupChartObservers } from '@/lib/chart-utils';
  import { MARKET_DRAWDOWNS } from '@/lib/constants';

  let container: HTMLElement;
  let width = $state(600);
  let dark = $state(false);
  const height = 220;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };

  onMount(() => {
    dark = isDark();
    return setupChartObservers(
      container,
      (w) => (width = w),
      () => (dark = isDark()),
    );
  });

  $effect(() => {
    if (!container) return;

    const theme = chartTheme(dark);

    const svg = d3.select(container).select('svg');
    svg.selectAll('*').remove();

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([1970, 2025]).range([0, innerW]);
    const y = d3.scaleLinear().domain([-60, 0]).range([innerH, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Zero line
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke', theme.axis)
      .attr('stroke-width', 1);

    // Drawdown bars
    MARKET_DRAWDOWNS.forEach((d) => {
      const barWidth = Math.max(x(d.recovery) - x(d.year), 8);

      g.append('rect')
        .attr('x', x(d.year))
        .attr('y', y(0))
        .attr('width', barWidth)
        .attr('height', y(d.drop) - y(0))
        .attr('fill', theme.red)
        .attr('opacity', dark ? 0.25 : 0.3)
        .attr('rx', 2);

      g.append('text')
        .attr('x', x(d.year) + barWidth / 2)
        .attr('y', y(d.drop) + 14)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', theme.red)
        .attr('font-weight', 'bold')
        .text(`${d.drop}%`);

      g.append('text')
        .attr('x', x(d.year) + barWidth / 2)
        .attr('y', y(0) - 6)
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .attr('fill', theme.label)
        .text(d.name);
    });

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(6)
          .tickFormat((d) => String(d)),
      )
      .call((sel) => styleAxis(sel, theme));

    g.append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(4)
          .tickFormat((d) => `${d}%`),
      )
      .call((sel) => styleAxis(sel, theme));
  });
</script>

<div bind:this={container} class="my-6 w-full">
  <svg
    {width}
    {height}
    class="overflow-visible"
    role="img"
    aria-label="Historical market drawdowns timeline showing major crashes and recovery periods"
  >
  </svg>
  <p class="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
    Every major crash was followed by full recovery and new highs. US share market (S&P 500) data;
    Australian and NZ crashes are listed above the chart.
  </p>
</div>
