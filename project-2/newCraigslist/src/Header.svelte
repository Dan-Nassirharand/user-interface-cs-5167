<script>
  import Title from './Title.svelte';
  import SearchBar from './SearchBar.svelte';
  import ThemeToggle from './ThemeToggle.svelte';

  let {
    home = false,
    query = '',
    onsearch,
    location = { continent: 'North America', country: 'United States', state: 'Ohio', city: 'Cincinnati' },
  } = $props();
</script>

<header class:home>
  {#if !home}
    <Title showLogo compact />
    <a class="location" href="/location" aria-label={`Change location: ${location.city}, ${location.state}, ${location.country}, ${location.continent}`}>
      <span class="location-level">{location.continent}</span>
      <span class="location-level">{location.country}</span>
      <span class="location-level">{location.state}</span>
      <strong>{location.city}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg></strong>
    </a>
    <div class="search"><SearchBar initialQuery={query} {onsearch} /></div>
  {/if}
  <div class="actions">
    <details class="account">
      <summary aria-label="Account" title="Account">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></svg>
      </summary>
      <div class="account-menu"><strong>Your account</strong><p>You are browsing as a guest.</p><span>Account sign-in will be available in a future update.</span></div>
    </details>
    <ThemeToggle inline />
  </div>
</header>

<style>
  header { display:flex; align-items:center; gap:2rem; padding:1.25rem 3rem; border-bottom:1px solid var(--border-subtle); background:var(--bg-surface); }
  header.home { border:0; background:transparent; }
  .location { display:flex; flex-direction:column; flex-shrink:0; gap:.1rem; padding:.25rem .5rem; border-radius:var(--radius-md); color:var(--text-secondary); font-size:.75rem; line-height:1.3; text-decoration:none; }
  .location:hover { background:var(--bg-secondary); }
  .location:focus-visible { outline:2px solid var(--color-accent); outline-offset:2px; }
  .location strong { display:flex; align-items:center; gap:.25rem; color:var(--color-primary); font-size:.875rem; }
  .location strong svg { width:1rem; height:1rem; }
  .search { flex:1; max-width:40rem; min-width:0; margin-left:auto; }
  .actions { display:flex; align-items:center; gap:.5rem; margin-left:auto; }
  .account { position:relative; }
  summary { display:grid; place-items:center; width:2.5rem; height:2.5rem; border-radius:var(--radius-md); cursor:pointer; list-style:none; color:var(--text-primary); }
  summary::-webkit-details-marker { display:none; }
  summary:hover { background:var(--bg-tertiary); }
  summary:focus-visible { outline:2px solid var(--color-accent); outline-offset:2px; }
  svg { width:1.5rem; height:1.5rem; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
  .account-menu { position:absolute; z-index:30; top:calc(100% + .75rem); right:0; width:250px; max-width:80vw; padding:1rem; border:1px solid var(--border-subtle); border-radius:var(--radius-lg); background:var(--bg-surface); box-shadow:var(--shadow-lg); font-size:.875rem; }
  .account-menu p { color:var(--text-secondary); margin:.5rem 0; }
  .account-menu span { font-size:.75rem; color:var(--text-secondary); }
  @media(max-width:900px) { header { gap:1rem; padding:1rem; flex-wrap:wrap; } .search { order:3; flex-basis:100%; max-width:none; } }
  @media(max-width:600px) { .location-level { display:none; } .location { padding:.25rem 0; } header { gap:.5rem; } }
  @media(max-width:400px) { .location { order:2; flex-basis:100%; } }
</style>
