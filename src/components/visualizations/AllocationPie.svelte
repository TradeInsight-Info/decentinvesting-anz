<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { isDark, chartTheme } from '@/lib/chart-utils';

  let {
    slices,
  }: {
    slices: { label: string; value: number; color: string }[];
  } = $props();

  let container: HTMLElement;
  let dark = $state(false);

  onMount(() => {
    dark = isDark();
    const themeObs = new MutationObserver(() => {
      dark = isDark();
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => themeObs.disconnect();
  });

  $effect(() => {
    if (!container) return;

    const theme = chartTheme(dark);
    // Read slices to establish reactive dependency
    const currentSlices = slices;

    const svg = d3.select(container).select('svg');
    svg.selectAll('*').remove();

    const size = 192;
    const radius = size / 2;
    const innerRadius = radius * 0.55;

    const g = svg.append('g').attr('transform', `translate(${radius},${radius})`);

    const pie = d3
      .pie<{ label: string; value: number; color: string }>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.02);

    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number; color: string }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 4)
      .cornerRadius(3);

    g.selectAll('path')
      .data(pie(currentSlices))
      .join('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', theme.pieBorder)
      .attr('stroke-width', 2);

    // Center label
    const total = currentSlices.reduce((sum, s) => sum + s.value, 0);
    const sharePct = currentSlices
      .filter((s) => s.label.includes('Share'))
      .reduce((sum, s) => sum + s.value, 0);
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .attr('fill', theme.text)
      .text(`${sharePct}/${total - sharePct}`);

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .attr('font-size', '11px')
      .attr('fill', theme.label)
      .text('shares / bonds');
  });
</script>

<div bind:this={container}>
  <svg width="192" height="192" role="img" aria-label="Portfolio allocation donut chart"> </svg>
</div>
