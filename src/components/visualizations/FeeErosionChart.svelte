<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { isDark, chartTheme, styleAxis, setupChartObservers } from '@/lib/chart-utils';

  let {
    data,
    feeA,
    feeB,
  }: {
    data: { year: number; valueA: number; valueB: number }[];
    feeA: number;
    feeB: number;
  } = $props();

  let container: HTMLElement;
  let width = $state(600);
  let dark = $state(false);
  const height = 300;
  const margin = { top: 20, right: 80, bottom: 40, left: 70 };

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

    const maxVal = d3.max(data, (d) => Math.max(d.valueA, d.valueB)) ?? 0;

    const x = d3
      .scaleLinear()
      .domain([0, data[data.length - 1].year])
      .range([0, innerW]);
    const y = d3.scaleLinear().domain([0, maxVal]).nice().range([innerH, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const lineA = d3
      .line<{ year: number; valueA: number }>()
      .x((d) => x(d.year))
      .y((d) => y(d.valueA))
      .curve(d3.curveMonotoneX);

    const lineB = d3
      .line<{ year: number; valueB: number }>()
      .x((d) => x(d.year))
      .y((d) => y(d.valueB))
      .curve(d3.curveMonotoneX);

    // Fill between lines
    const area = d3
      .area<{ year: number; valueA: number; valueB: number }>()
      .x((d) => x(d.year))
      .y0((d) => y(d.valueB))
      .y1((d) => y(d.valueA))
      .curve(d3.curveMonotoneX);

    g.append('path').datum(data).attr('d', area).attr('fill', theme.red).attr('opacity', 0.1);

    // Low fee line
    g.append('path')
      .datum(data)
      .attr('d', lineA)
      .attr('fill', 'none')
      .attr('stroke', theme.green)
      .attr('stroke-width', 2.5);

    // High fee line
    g.append('path')
      .datum(data)
      .attr('d', lineB)
      .attr('fill', 'none')
      .attr('stroke', theme.red)
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '6 3');

    // Labels at end
    const last = data[data.length - 1];
    g.append('text')
      .attr('x', innerW + 4)
      .attr('y', y(last.valueA))
      .attr('dy', '0.35em')
      .attr('font-size', '11px')
      .attr('fill', theme.green)
      .text(`${feeA}%`);

    g.append('text')
      .attr('x', innerW + 4)
      .attr('y', y(last.valueB))
      .attr('dy', '0.35em')
      .attr('font-size', '11px')
      .attr('fill', theme.red)
      .text(`${feeB}%`);

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
  <svg
    {width}
    {height}
    class="overflow-visible"
    role="img"
    aria-label="Fee impact comparison chart showing diverging growth lines"
  >
  </svg>
</div>
