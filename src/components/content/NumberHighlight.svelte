<script lang="ts">
  import { onMount } from 'svelte';

  let {
    value,
    prefix = '',
    suffix = '',
    duration = 1500,
  }: {
    value: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
  } = $props();

  let displayValue = $state(0);
  let container: HTMLElement;
  let animFrameId = 0;

  onMount(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      displayValue = value;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animate();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animFrameId);
    };
  });

  function animate() {
    const start = performance.now();
    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      displayValue = Math.round(value * eased);
      if (progress < 1) {
        animFrameId = requestAnimationFrame(step);
      }
    }
    animFrameId = requestAnimationFrame(step);
  }
</script>

<span bind:this={container} class="font-bold tabular-nums text-sage-700 dark:text-sage-400">
  {prefix}{displayValue.toLocaleString()}{suffix}
</span>
