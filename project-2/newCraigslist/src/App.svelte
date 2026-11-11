<script>
  import Home from './Home.svelte';
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import SearchResults from './SearchResults.svelte';
  import Location from './Location.svelte';
  import { onMount } from 'svelte';

  let route = $state(window.location.pathname);
  let params = $state(new URLSearchParams(window.location.search));

  function syncRoute() {
    route = window.location.pathname;
    params = new URLSearchParams(window.location.search);
  }

  function search(query, mode) {
    const next = new URLSearchParams();
    next.set(mode === 'location' ? 'location' : 'q', query);
    const path = mode === 'location' ? '/location' : '/search-final';
    history.pushState({}, '', `${path}?${next}`);
    syncRoute();
    window.scrollTo(0, 0);
  }

  onMount(() => {
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  });
</script>

{#if route === '/search-final'}
  <Header query={params.get('q') ?? ''} onsearch={search} />
  {#key params.toString()}
    <SearchResults query={params.get('q') ?? ''} location={params.get('location') || 'Cincinnati, OH'} onsearch={search} />
  {/key}
  <Footer />
{:else if route === '/location'}
  <Header onsearch={search} />
  <Location />
  <Footer />
{:else}
  <ThemeToggle />
  <Home onsearch={search} />
{/if}
