<script>
  let { showDemo = true } = $props();
</script>

<footer>
  <a href="/">craigslist</a>
  <span>Local connections. Everyday possibilities.</span>
  {#if showDemo}<span>Demo · All listings are mock data.</span>{/if}
</footer>

<style>
  footer { display:flex; justify-content:space-between; flex-wrap:wrap; gap:1rem; border-top:1px solid var(--border-subtle); padding:1.5rem 0; margin:3rem auto 0; width:calc(100% - 6rem); max-width:1404px; color:var(--text-secondary); font-size:.75rem; }
  a { color:var(--color-primary); }
  @media(max-width:760px) { footer { width:calc(100% - 2rem); } }
</style>
