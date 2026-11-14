<script>
  let scrollY = $state(0);
</script>

<svelte:window bind:scrollY />

{#if scrollY > 100}
  <button
    type="button"
    class="back-to-top"
    aria-label="Back to top"
    title="Back to top"
    onclick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 10 6-6 6 6M12 4v16" />
    </svg>
  </button>
{/if}

<style>
  .back-to-top {
    position: fixed;
    right: max(1.25rem, env(safe-area-inset-right));
    bottom: max(1.25rem, env(safe-area-inset-bottom));
    z-index: 20;
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: var(--color-primary-contrast);
    background: var(--color-primary);
    box-shadow: var(--shadow-lg);
    font: inherit;
    cursor: pointer;
  }
  .back-to-top:hover { background: var(--color-primary-hover); }
  .back-to-top:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }
  .back-to-top svg { width: 1.4rem; height: 1.4rem; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
</style>
