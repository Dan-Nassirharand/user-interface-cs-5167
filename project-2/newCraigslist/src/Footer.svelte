<script>
  import BackToTop from './BackToTop.svelte';

  // The location page already supplies the same responsive page-shell gutters.
  let { embedded = false } = $props();
</script>

<div class="footer-shell" class:embedded>
  <footer class="site-footer">
    <span>© {new Date().getFullYear()} craigslist</span>
  </footer>
</div>
<BackToTop />

<style>
  .footer-shell { max-width: 1500px; margin: auto; padding: 2rem 3rem 0; }
  .footer-shell.embedded { max-width: none; padding-inline: 0; }
  .site-footer { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; min-height: 88px; margin: 0; padding: 1.1rem 0 1.5rem; border-top: 1px solid var(--border-subtle); font-size: 0.65rem; color: var(--text-secondary); }
  @media (min-width: 761px) {
    /* Match the filter text's 2rem outset and 0.35rem inner padding. */
    :global(main:has(#search-filters)) ~ .footer-shell:not(.embedded) { padding-left: 1.35rem; }
  }
  @media (max-width: 760px) { .footer-shell { padding-inline: 1rem; } }
  @media (max-width: 540px) {
    .site-footer { font-size: 0.6rem; }
  }
</style>
