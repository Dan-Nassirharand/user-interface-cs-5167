<script>
  import Home from './Home.svelte';
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import LocationPage, { locations } from './LocationPage.svelte';
  import SearchResults from './SearchResults.svelte';

  const stateNames = { OH: 'Ohio', IL: 'Illinois', NY: 'New York', MA: 'Massachusetts', TX: 'Texas', WA: 'Washington', CA: 'California' };
  const cityAliases = { nyc: 'new-york-ny', 'new york': 'new-york-ny', sf: 'san-francisco-ca', la: 'los-angeles-ca', cinci: 'cincinnati-oh' };

  function readSavedTheme() {
    try { return localStorage.getItem('theme') === 'dark'; }
    catch { return false; }
  }

  function readFavoriteLocation() {
    try {
      const saved = JSON.parse(localStorage.getItem('craigslist-profile-v1') || 'null');
      if (locations.some((item) => item.id === saved?.favoriteLocation)) return saved.favoriteLocation;
    } catch { /* Use the default area when no saved preference is available. */ }
    return locations[0].id;
  }

  let dark = $state(readSavedTheme());
  let route = $state('/');
  let params = $state(new URLSearchParams());
  let lastLocationId = $state(readFavoriteLocation());

  const currentLocation = $derived(findLocation(params.get('location')) || locations.find((item) => item.id === lastLocationId) || locations[0]);
  const locationLabel = $derived(`${currentLocation.city}, ${currentLocation.state}`);
  const locationHref = $derived(`/location?${new URLSearchParams({ location: currentLocation.id })}`);
  const headerLocation = $derived({
    continent: 'North America',
    country: 'United States',
    state: stateNames[currentLocation.state],
    city: currentLocation.city,
  });

  function normalize(value) {
    return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function findLocation(value) {
    const text = normalize(value);
    if (!text) return undefined;
    if (cityAliases[text]) return locations.find((item) => item.id === cityAliases[text]);
    const exact = locations.find((item) => [item.id, item.city, `${item.city} ${item.state}`, `${item.city} ${stateNames[item.state]}`].some((name) => normalize(name) === text));
    return exact || (text.length >= 2 ? locations.find((item) => normalize(item.city).startsWith(text)) : undefined);
  }

  function canonicalUrl(url) {
    // Keep bookmarks from the temporary page switch working after its removal.
    if (url.hash === '#home') {
      url.pathname = '/';
      url.search = '';
      url.hash = '';
    } else if (url.hash === '#location') {
      url.pathname = '/location';
      url.hash = '';
    } else if (url.hash.startsWith('#search?')) {
      const search = url.hash.slice(8);
      url.pathname = '/search-final';
      url.search = search;
      url.hash = '';
    } else if (url.pathname === '/' && url.hash === '#location-categories') {
      url.pathname = '/location';
    }
    if (url.pathname === '/search') url.pathname = '/search-final';
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '');
    return url;
  }

  function syncRoute() {
    const url = canonicalUrl(new URL(window.location.href));
    if (url.pathname === '/location' || url.pathname === '/search-final') {
      const area = findLocation(url.searchParams.get('location')) || locations.find((item) => item.id === lastLocationId) || locations[0];
      url.searchParams.set('location', area.id);
      lastLocationId = area.id;
    }
    if (url.href !== window.location.href) history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
    route = url.pathname;
    params = new URLSearchParams(url.search);
  }

  function navigate(destination) {
    const url = canonicalUrl(new URL(destination, window.location.origin));
    const next = `${url.pathname}${url.search}${url.hash}`;
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) history.pushState({}, '', next);
    syncRoute();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  function goToLocation(id) {
    const area = findLocation(id) || currentLocation;
    navigate(`/location?${new URLSearchParams({ location: area.id })}`);
  }

  function search(query, mode = 'search') {
    const text = String(query || '').trim();
    if (mode === 'location') {
      const area = findLocation(text);
      if (!area) return 'Choose a supported city, such as Cincinnati, Chicago, Columbus, or New York City.';
      goToLocation(area.id);
      return;
    }
    const next = new URLSearchParams({ location: currentLocation.id });
    if (text) next.set('q', text);
    navigate(`/search-final?${next}`);
  }

  function searchFromLocation(request) {
    const next = new URLSearchParams({ location: request.location || currentLocation.id });
    if (request.query) next.set('q', request.query);
    // Results use the selected subcategory when matching mock listings exist.
    if (request.category) next.set('category', request.category);
    if (request.subcategory) next.set('subcategory', request.subcategory);
    navigate(`/search-final?${next}`);
  }

  function followInternalLink(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    const legacyPage = url.hash === '#home' || url.hash === '#location' || url.hash.startsWith('#search?');
    // Let in-page links, such as Skip to categories, keep their normal scrolling behavior.
    if (!legacyPage && url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;
    if (!['/', '/location', '/search-final', '/search'].includes(url.pathname)) return;
    event.preventDefault();
    navigate(`${url.pathname}${url.search}${url.hash}`);
  }

  syncRoute();
</script>

<svelte:head>{#if route !== '/location' && route !== '/search-final'}<title>craigslist</title>{/if}</svelte:head>
<svelte:window onpopstate={syncRoute} onhashchange={syncRoute} onclick={followInternalLink} />

{#if route === '/search-final'}
  <Header query={params.get('q') || ''} location={headerLocation} {locationHref} onsearch={search} bind:dark />
  {#key params.toString()}
    <SearchResults query={params.get('q') || ''} location={locationLabel} initialCategory={params.get('category') || ''} initialSubcategory={params.get('subcategory') || ''} onsearch={search} />
  {/key}
  <Footer />
{:else if route === '/location'}
  <LocationPage bind:dark locationId={currentLocation.id} onsearch={searchFromLocation} onlocationchange={goToLocation} />
{:else}
  <ThemeToggle bind:dark />
  <Home onsearch={search} />
{/if}
