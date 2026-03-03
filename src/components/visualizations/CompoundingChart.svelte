<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { isDark, chartTheme, styleAxis, setupChartObservers } from '@/lib/chart-utils';

  let {
    data,
    totalContributed,
  }: {
    data: { year: number; balance: number }[];
    totalContributed: number;
  } = $props();

  let container: HTMLElement;
  let width = $state(600);
  let dark = $state(false);
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 70 };

  onMount(() => {
    dark = isDark();
    return setupChartObservers(
      container,
      (w) => (width = w),
      () => (dark = isDark()),
    );
  });

  $effect(() => {
    if (!container || data.length === 0) return;

    const theme = chartTheme(dark);

    const svg = d3.select(container).select('svg');
    svg.selectAll('*').remove();

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain([0, data[data.length - 1].year])
      .range([0, innerW]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.balance) ?? 0])
      .nice()
      .range([innerH, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Contribution area
    const contribLine = data.map((d) => {
      const contributed =
        totalContributed > 0
          ? Math.min(d.balance, totalContributed * (d.year / (data[data.length - 1].year || 1)))
          : 0;
      return { year: d.year, value: contributed };
    });

    const areaContrib = d3
      .area<{ year: number; value: number }>()
      .x((d) => x(d.year))
      .y0(innerH)
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(contribLine)
      .attr('d', areaContrib)
      .attr('fill', theme.greenMuted)
      .attr('opacity', dark ? 0.3 : 0.5);

    // Growth area
    const areaGrowth = d3
      .area<{ year: number; balance: number }>()
      .x((d) => x(d.year))
      .y0(innerH)
      .y1((d) => y(d.balance))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('d', areaGrowth)
      .attr('fill', theme.green)
      .attr('opacity', 0.3);

    // Balance line
    const line = d3
      .line<{ year: number; balance: number }>()
      .x((d) => x(d.year))
      .y((d) => y(d.balance))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', theme.green)
      .attr('stroke-width', 2.5);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(Math.min(data.length - 1, 10))
          .tickFormat((d) => `${d}y`),
      )
      .call((sel) => styleAxis(sel, theme));

    g.append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `$${d3.format('.2s')(d as number)}`),
      )
      .call((sel) => styleAxis(sel, theme));
  });
</script>

<div bind:this={container} class="w-full">
  <svg {width} {height} class="overflow-visible" role="img" aria-label="Compound growth chart">
  </svg>
</div>
