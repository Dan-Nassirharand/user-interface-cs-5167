<script module>
  // Shared by the router and location picker so both use the same supported cities.
  export const locations = [
    { id: 'cincinnati-oh', city: 'Cincinnati', state: 'OH' },
    { id: 'columbus-oh', city: 'Columbus', state: 'OH' },
    { id: 'cleveland-oh', city: 'Cleveland', state: 'OH' },
    { id: 'chicago-il', city: 'Chicago', state: 'IL' },
    { id: 'new-york-ny', city: 'New York City', state: 'NY' },
    { id: 'boston-ma', city: 'Boston', state: 'MA' },
    { id: 'austin-tx', city: 'Austin', state: 'TX' },
    { id: 'seattle-wa', city: 'Seattle', state: 'WA' },
    { id: 'san-francisco-ca', city: 'San Francisco', state: 'CA' },
    { id: 'los-angeles-ca', city: 'Los Angeles', state: 'CA' },
  ];
</script>

<script>
  import { tick } from 'svelte';
  import LocationIcon from './LocationIcon.svelte';
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
  import SettingsPanel from './SettingsPanel.svelte';
  import PostComposer from './PostComposer.svelte';
  import MyPosts from './MyPosts.svelte';

  let { onsearch, onlocationchange, locationId = '', dark = $bindable(false) } = $props();

  const categories = [
    { id: 'housing', title: 'Housing', icon: 'housing', tone: 'purple', description: 'Find a place to call home', subcategories: ['Apartments & rentals', 'Rooms & shared', 'Real estate for sale', 'Sublets & temporary', 'Vacation rentals', 'Housing wanted'] },
    { id: 'jobs', title: 'Jobs', icon: 'jobs', tone: 'blue', description: 'Make your next career move', subcategories: ['Technology', 'Engineering', 'Office & admin', 'Finance & accounting', 'Education', 'Skilled trades', 'Healthcare', 'Food & hospitality', 'Sales & marketing'] },
    { id: 'auto', title: 'Auto', icon: 'auto', tone: 'green', description: 'Your next set of wheels', subcategories: ['Cars & trucks', 'Motorcycles', 'Auto parts', 'RVs & campers', 'Boats', 'Trailers'] },
    { id: 'services', title: 'Services', icon: 'services', tone: 'blue', description: 'A little help from a local', subcategories: ['Home & repair', 'Creative services', 'Computer & tech', 'Lessons & tutoring', 'Beauty & wellness', 'Moving & storage', 'Legal & financial', 'Pet care', 'Automotive services'] },
    { id: 'forums', title: 'Forums', icon: 'forums', tone: 'green', description: 'Join the conversation', subcategories: ['Local discussion', 'Arts & culture', 'Food & cooking', 'Technology', 'Travel', 'Gardening', 'Music', 'Sports', 'Pets'] },
    { id: 'shopping', title: 'Shopping', icon: 'shopping', tone: 'purple', description: 'Secondhand. First-rate finds.', subcategories: ['Furniture', 'Electronics', 'Clothing & accessories', 'Home & garden', 'Bikes', 'Books & media', 'Sporting goods', 'Tools', 'Collectibles'] },
    { id: 'community', title: 'Community', icon: 'community', tone: 'green', description: 'Meet your neighborhood', subcategories: ['Activities & events', 'Groups & clubs', 'Volunteers', 'Classes', 'Lost & found', 'Local news'] },
    { id: 'gigs', title: 'Gigs', icon: 'gigs', tone: 'purple', description: 'Small projects. Possibilities.', subcategories: ['Computer gigs', 'Creative gigs', 'Event gigs', 'Labor & moving', 'Writing', 'Talent & performance'] },
    { id: 'free', title: 'Freebies', icon: 'free', tone: 'blue', description: 'Give a little. Find a lot.', subcategories: ['Free stuff', 'Barter & trade', 'Curb alerts', 'Items wanted', 'Materials & supplies', 'Community swaps'] },
  ];
  const categoryRows = [categories.slice(0, 3), categories.slice(3, 6), categories.slice(6, 9)];

  const profileStorageKey = 'craigslist-profile-v1';

  function readProfile() {
    const defaults = { username: '', email: '', phone: '', avatar: '', favoriteLocation: 'cincinnati-oh' };
    try {
      const saved = JSON.parse(localStorage.getItem(profileStorageKey) || 'null');
      if (!saved || typeof saved !== 'object') return defaults;
      return {
        username: typeof saved.username === 'string' ? saved.username.slice(0, 40) : '',
        email: typeof saved.email === 'string' ? saved.email.slice(0, 254) : '',
        phone: typeof saved.phone === 'string' ? saved.phone.slice(0, 30) : '',
        avatar: typeof saved.avatar === 'string' && /^data:image\/(jpeg|png|webp|gif);base64,/.test(saved.avatar) && saved.avatar.length < 400000 ? saved.avatar : '',
        favoriteLocation: locations.some((item) => item.id === saved.favoriteLocation) ? saved.favoriteLocation : defaults.favoriteLocation,
      };
    } catch { return defaults; }
  }

  const initialProfile = readProfile();
  let profile = $state(initialProfile);
  // Start in the saved favorite area; this does not request browser geolocation.
  let location = $state(locations.find((item) => item.id === initialProfile.favoriteLocation) || locations[0]);
  $effect(() => {
    const requestedLocation = locations.find((item) => item.id === locationId);
    if (requestedLocation) {
      location = requestedLocation;
      searchPreview = null;
    }
  });
  let settingsOpen = $state(false);
  let postOpen = $state(false);
  let myPostsOpen = $state(false);
  let notice = $state('');
  let locationQuery = $state('');
  let selectedCategory = $state(null);
  let searchPreview = $state(null);
  let locationDialog;
  let searchFeedback = $state(null);
  const filteredLocations = $derived(locations.filter((item) =>
    `${item.city} ${item.state}`.toLowerCase().includes(locationQuery.trim().toLowerCase())
  ));

  function toggleCategory(category) {
    selectedCategory = selectedCategory?.id === category.id ? null : category;
  }

  function closeCategory() {
    const id = selectedCategory?.id;
    selectedCategory = null;
    document.getElementById(`category-${id}`)?.focus();
  }

  function searchHref(category = '', subcategory = '', searchQuery = '') {
    const params = new URLSearchParams({ location: location.id });
    if (category) params.set('category', category);
    if (subcategory) params.set('subcategory', subcategory);
    if (searchQuery) params.set('q', searchQuery);
    return `/search-final?${params}`;
  }

  async function requestSearch(event, category = null, subcategory = '', searchQuery = '') {
    event?.preventDefault();
    const request = {
      location: location.id,
      locationLabel: `${location.city}, ${location.state}`,
      category: category?.id ?? '',
      subcategory,
      query: searchQuery.trim(),
      href: searchHref(category?.id, subcategory, searchQuery.trim()),
    };
    if (onsearch) onsearch(request);
    else {
      searchPreview = request;
      await tick();
      searchFeedback?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  }

  function chooseLocation(nextLocation) {
    location = nextLocation;
    searchPreview = null;
    locationDialog.close();
    onlocationchange?.(nextLocation.id);
  }

  function openLocationDialog() {
    locationQuery = '';
    locationDialog.showModal();
  }

  function saveProfile(nextProfile) {
    try { localStorage.setItem(profileStorageKey, JSON.stringify(nextProfile)); }
    catch { throw new Error('Your settings could not be saved. Browser storage may be full or unavailable. Try a smaller profile photo.'); }
    if (nextProfile.favoriteLocation !== profile.favoriteLocation) {
      location = locations.find((item) => item.id === nextProfile.favoriteLocation) || locations[0];
      searchPreview = null;
      onlocationchange?.(location.id);
    }
    profile = { ...nextProfile };
    notice = 'Your settings have been saved in this browser.';
    settingsOpen = false;
  }
</script>

<svelte:head>
  <title>{location.city} | craigslist</title>
</svelte:head>

<div class="location-page">
  <a class="skip-link" href="#location-categories">Skip to categories</a>

  <Header {location} {locations} accountProfile={profile} bind:dark
    searchPlaceholder={`Search in ${location.city}...`}
    searchLabel={`Search craigslist in ${location.city}`}
    onsearch={(query) => requestSearch(null, null, '', query)}
    onlocationselect={openLocationDialog} onsettings={() => settingsOpen = true} />

  <div class="page-shell">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a><LocationIcon name="chevron-right" size={13} />
      <span aria-current="page">{location.city}, {location.state}</span>
    </nav>

    <div class="page-layout">
      <aside class="sidebar" aria-label="Location and tools">
        <section class="location-card" aria-labelledby="your-area-title">
          <div class="area-map" aria-hidden="true">
            <svg viewBox="0 0 260 150" preserveAspectRatio="xMidYMid slice">
              <rect width="260" height="150" fill="var(--bg-tertiary)" />
              <path d="M-10 8H68L87 46H38ZM170 13H240V55H183ZM10 108H79V151H-5ZM186 93H263V146H213Z" fill="var(--color-sage)" opacity="0.14" />
              <g fill="none" stroke="var(--bg-surface)" stroke-width="9">
                <path d="M-20 34L280 117M-15 105L280 27M55-10L107 160M164-10L216 160" />
              </g>
              <path d="M-20 139C30 85 76 151 126 117S199 61 280 85" fill="none" stroke="var(--color-accent)" stroke-width="17" opacity="0.2" />
              <path d="M-20 65L280 143M104-10L151 160" fill="none" stroke="var(--border-default)" stroke-width="2" />
              <circle cx="131" cy="66" r="24" fill="var(--color-primary)" opacity="0.12" />
              <circle cx="131" cy="66" r="14" fill="var(--bg-surface)" />
              <path d="M131 49a11 11 0 0 0-11 11c0 8 11 18 11 18s11-10 11-18a11 11 0 0 0-11-11Z" fill="var(--color-primary)" />
              <circle cx="131" cy="60" r="3.5" fill="var(--color-primary-contrast)" />
            </svg>
            <span>Area preview</span>
          </div>
          <div class="location-card-content">
            <p class="eyebrow" id="your-area-title">Your browsing area</p>
            <h2>{location.city}, {location.state}</h2>
            <p class="area-note">Find what’s nearby.</p>
            <button class="change-location" onclick={openLocationDialog} aria-haspopup="dialog">Change location <LocationIcon name="chevron-down" size={15} /></button>
          </div>
        </section>

        <section class="post-card" aria-labelledby="post-title">
          <h2 id="post-title">Something to share?</h2>
          <p>Your next buyer, neighbor, or opportunity is right here.</p>
          <button onclick={() => postOpen = true} aria-haspopup="dialog">Create a post <LocationIcon name="arrow-up-right" size={17} /></button>
          <button class="my-posts-link" onclick={() => myPostsOpen = true} aria-haspopup="dialog">My posts <LocationIcon name="chevron-right" size={15} /></button>
        </section>

        <button class="settings-tile" onclick={() => settingsOpen = true} aria-haspopup="dialog">
          <LocationIcon name="settings" size={21} />
          <span><strong>Settings</strong><small>Profile & preferences</small></span>
          <LocationIcon name="chevron-right" size={16} />
        </button>
      </aside>

      <main id="location-categories" tabindex="-1">
        <div class="intro">
          <div class="local-label"><span></span> LOCAL FINDS. REAL CONNECTIONS.</div>
          <h1>Explore <span>{location.city}.</span></h1>
          <p>A place to live. A new opportunity. Something just right.</p>
        </div>

        {#if notice}
          <div class="local-notice" role="status"><LocationIcon name="check" size={18} /><span>{notice}</span><button class="icon-button" onclick={() => notice = ''} aria-label="Dismiss confirmation"><LocationIcon name="close" size={17} /></button></div>
        {/if}

        {#if searchPreview}
          <div class="search-handoff" role="status" bind:this={searchFeedback}>
            <LocationIcon name="info" size={22} />
            <div>
              <strong>Your search is ready for the next page.</strong>
              <p>{searchPreview.query || searchPreview.subcategory || categories.find((category) => category.id === searchPreview.category)?.title || 'All listings'} · {searchPreview.locationLabel}</p>
              <small>The search page is being built. This selection is ready to connect.</small>
            </div>
            <button class="icon-button" onclick={() => searchPreview = null} aria-label="Dismiss search preview"><LocationIcon name="close" size={18} /></button>
          </div>
        {/if}

        <div class="section-heading">
          <h2>Pick a category to explore</h2>
        </div>

        <div class="category-rows">
          {#each categoryRows as row, rowIndex}
            <div class="category-row">
              <div class="category-grid">
                {#each row as category}
                  <button
                    id={`category-${category.id}`}
                    class="category-tile {category.tone}"
                    class:selected={selectedCategory?.id === category.id}
                    aria-expanded={selectedCategory?.id === category.id}
                    aria-controls={selectedCategory?.id === category.id ? `subcategories-${rowIndex}` : undefined}
                    onclick={() => toggleCategory(category)}
                  >
                    <span class="tile-top"><span class="category-icon"><LocationIcon name={category.icon} size={26} /></span><span class="tile-arrow"><LocationIcon name={selectedCategory?.id === category.id ? 'chevron-down' : 'arrow-up-right'} size={19} /></span></span>
                    <span class="category-title">{category.title}</span>
                    <span class="category-description">{category.description}</span>
                  </button>
                {/each}
              </div>

              {#if selectedCategory && row.some((category) => category.id === selectedCategory.id)}
                <section class="subcategory-panel" id={`subcategories-${rowIndex}`} aria-labelledby={`category-${selectedCategory.id}`}>
                  <div class="subcategory-heading">
                    <div><h3>Explore {selectedCategory.title.toLowerCase()}</h3><p>A good place to start.</p></div>
                    <button class="icon-button" onclick={closeCategory} aria-label="Close subcategories"><LocationIcon name="close" size={20} /></button>
                  </div>
                  <div class="subcategory-links">
                    {#each selectedCategory.subcategories as subcategory}
                      <a href={searchHref(selectedCategory.id, subcategory)} onclick={(event) => requestSearch(event, selectedCategory, subcategory)}>{subcategory}<LocationIcon name="arrow-right" size={16} /></a>
                    {/each}
                  </div>
                  <a class="browse-all" href={searchHref(selectedCategory.id)} onclick={(event) => requestSearch(event, selectedCategory)}>Browse all {selectedCategory.title.toLowerCase()} <LocationIcon name="arrow-right" size={16} /></a>
                </section>
              {/if}
            </div>
          {/each}
        </div>

        <footer class="content-footer"><span aria-hidden="true"></span><span>Find. <span>Shop.</span> <span class="list-word">List.</span></span></footer>
      </main>
    </div>
    <Footer embedded />
  </div>
</div>

<dialog bind:this={locationDialog} class="utility-dialog" aria-labelledby="location-dialog-title">
  <div class="dialog-heading"><span class="dialog-icon"><LocationIcon name="pin" size={24} /></span><button class="icon-button" onclick={() => locationDialog.close()} aria-label="Close location picker"><LocationIcon name="close" size={20} /></button></div>
  <h2 id="location-dialog-title">Where are you looking?</h2>
  <p>Choose a city to make craigslist a little more local.</p>
  <label class="location-search"><LocationIcon name="search" size={19} /><input type="search" placeholder="Search city or state abbreviation" aria-label="Find a browsing location" bind:value={locationQuery} /></label>
  <p class="picker-label">{locationQuery.trim() ? 'Matching locations' : 'Available locations'}</p>
  <div class="location-results">
    {#each filteredLocations as item}
      <button onclick={() => chooseLocation(item)} aria-label={`Browse ${item.city}, ${item.state}`}><span><LocationIcon name="pin" size={17} />{item.city}<small>{item.state}</small></span>{#if location.id === item.id}<LocationIcon name="check" size={18} />{:else}<LocationIcon name="arrow-right" size={17} />{/if}</button>
    {:else}
      <p class="empty-locations">No matching cities. Try a nearby city or a state abbreviation.</p>
    {/each}
  </div>
</dialog>

<SettingsPanel open={settingsOpen} {profile} {locations} {dark} onsave={saveProfile} onclose={() => settingsOpen = false} onthemechange={(value) => dark = value} />
<PostComposer open={postOpen} {categories} {location} {profile} onclose={() => postOpen = false} onposted={() => notice = 'Your post has been saved locally in this browser.'} />
<MyPosts open={myPostsOpen} {categories} onclose={() => myPostsOpen = false} />

<style>
  .location-page, .utility-dialog {
    /* Keep small white labels readable in both palettes without changing theme.css. */
    --location-action: color-mix(in srgb, var(--color-primary) 78%, black);
    --location-action-hover: color-mix(in srgb, var(--color-primary) 68%, black);
  }
  .location-page { min-height: 100vh; background: var(--bg-secondary); }
  button, input { font: inherit; }
  button { cursor: pointer; }
  button, a, input { -webkit-tap-highlight-color: transparent; }
  button:focus-visible, a:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 3px; }
  .location-search input:focus { outline: none; box-shadow: none; }
  h1, h2, h3, p { margin: 0; }
  .skip-link { position: fixed; top: -5rem; left: 1rem; z-index: 50; background: var(--bg-surface); padding: 0.75rem 1rem; border: 1px solid var(--border-default); border-radius: var(--radius-md); }
  .skip-link:focus { top: 1rem; }
  .location-search:focus-within { border-color: var(--color-primary); }
  .page-shell { max-width: 1360px; margin: auto; padding: 0 2.75rem; }
  .breadcrumb { display: flex; align-items: center; gap: 0.65rem; padding: 1.5rem 0; font-size: var(--text-xs); color: var(--text-secondary); }
  .breadcrumb a { color: var(--text-secondary); }
  .page-layout { display: grid; grid-template-columns: 238px minmax(0, 1fr); gap: 2.75rem; }
  .sidebar { display: flex; flex-direction: column; align-items: stretch; gap: 1rem; }
  .location-card { overflow: hidden; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); background: var(--bg-surface); }
  .area-map { height: 139px; position: relative; overflow: hidden; border-bottom: 1px solid var(--border-subtle); }
  .area-map svg { display: block; height: 100%; width: 100%; }
  .area-map > span { position: absolute; left: 0.6rem; bottom: 0.5rem; padding: 0.1rem 0.35rem; border-radius: var(--radius-sm); background: var(--bg-surface); color: var(--text-secondary); font-size: 0.6rem; }
  .location-card-content { padding: 1.2rem; }
  .eyebrow { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: var(--weight-semibold); color: var(--text-secondary); }
  .location-card h2 { font-size: var(--text-lg); line-height: var(--leading-tight); margin: 0.5rem 0 0.35rem; }
  .area-note { color: var(--text-secondary); font-size: var(--text-xs); }
  .change-location { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-top: 1.15rem; padding: 0.55rem 0.7rem; width: 100%; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); background: var(--bg-surface); color: var(--color-primary); font-size: var(--text-xs); font-weight: var(--weight-semibold); }
  .change-location:hover { border-color: var(--color-primary); background: var(--color-primary-light); }
  .post-card { padding: 1rem 1.2rem 1.2rem; border-radius: var(--radius-lg); background: var(--location-action); color: var(--color-primary-contrast); }
  .post-card h2 { font-size: 1.05rem; font-weight: var(--weight-semibold); }
  .post-card p { margin-top: 0.5rem; font-size: var(--text-xs); line-height: var(--leading-relaxed); }
  .post-card button { display: flex; align-items: center; justify-content: space-between; gap: 1rem; width: 100%; margin-top: 1.35rem; padding: 0.65rem 0.75rem; border: 0; border-radius: var(--radius-sm); background: var(--bg-surface); color: var(--text-primary); font-weight: var(--weight-semibold); font-size: var(--text-xs); }
  .post-card button:hover { background: var(--bg-tertiary); }
  .post-card .my-posts-link { margin-top: 0.65rem; padding: 0.3rem 0; border-radius: 0; background: transparent; color: var(--color-primary-contrast); font-weight: var(--weight-medium); }
  .post-card .my-posts-link:hover { background: transparent; text-decoration: underline; }
  .settings-tile { display: flex; align-items: center; gap: 0.8rem; padding: 1rem 1.2rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--bg-surface); color: var(--text-secondary); text-align: left; }
  .settings-tile:hover { border-color: var(--color-primary); color: var(--color-primary); }
  .settings-tile > :global(svg:last-child) { margin-left: auto; }
  .settings-tile span { display: grid; gap: 0.1rem; }
  .settings-tile strong { font-size: var(--text-sm); font-weight: var(--weight-medium); }
  .settings-tile small { font-size: 0.65rem; }
  /* Shift the right column up alongside the breadcrumb. */
  main { min-width: 0; outline: none; margin-top: -3rem; }
  /* Balance the responsive title height so the category rows align with the sidebar. */
  .intro { padding: 0.4rem 0 clamp(0.65rem, calc(3.9rem - 3.75vw), 1.65rem); }
  .local-label { display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: 0.62rem; font-weight: var(--weight-semibold); letter-spacing: 0.12em; }
  .local-label > span { width: 6px; height: 6px; background: var(--color-sage); border-radius: 50%; }
  h1 { font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: var(--weight-semibold); line-height: var(--leading-tight); letter-spacing: -0.045em; margin: 0.8rem 0 0.5rem; }
  h1 > span { color: var(--color-primary); }
  .intro > p { color: var(--text-secondary); font-size: var(--text-sm); }
  .section-heading { margin-bottom: 0.8rem; }
  .section-heading h2 { color: var(--text-secondary); font-size: var(--text-xs); font-weight: var(--weight-medium); }
  .local-notice { display: flex; align-items: center; gap: 0.65rem; padding: 0.75rem 1rem; margin-bottom: 1.25rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--color-success-bg); color: var(--color-success-text); font-size: var(--text-xs); }
  .local-notice > span { flex: 1; }
  .category-rows { display: flex; flex-direction: column; gap: 1rem; }
  .category-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
  .category-tile { display: flex; flex-direction: column; align-items: stretch; text-align: left; padding: 1.15rem 1.25rem; min-height: 158px; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); background: var(--bg-surface); color: var(--text-primary); box-shadow: var(--shadow-sm); transition: var(--theme-transition), box-shadow var(--transition-fast), transform var(--transition-fast); }
  .category-tile:hover { transform: translateY(-3px); border-color: var(--color-primary); box-shadow: var(--shadow-md); }
  .category-tile.selected { border-color: var(--color-primary); background: color-mix(in srgb, var(--color-primary-light) 30%, var(--bg-surface)); box-shadow: 0 0 0 1px var(--color-primary); }
  .tile-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem; }
  .category-icon { width: 43px; height: 43px; display: grid; place-items: center; border-radius: var(--radius-md); color: var(--color-primary); background: var(--color-primary-light); }
  .blue .category-icon { color: var(--color-accent); background: var(--color-accent-light); }
  .green .category-icon { color: var(--color-sage); background: color-mix(in srgb, var(--color-sage) 12%, var(--bg-surface)); }
  .tile-arrow { color: var(--text-secondary); display: flex; padding-top: 0.15rem; }
  .selected .tile-arrow { color: var(--color-primary); }
  .category-title { font-size: var(--text-lg); font-weight: var(--weight-semibold); letter-spacing: -0.02em; }
  .category-description { font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.2rem; }
  .subcategory-panel { margin-top: 0.85rem; padding: 1.3rem; background: var(--bg-surface); border: 1px solid var(--color-primary); border-radius: var(--radius-lg); }
  .subcategory-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.1rem; }
  .subcategory-heading h3 { font-size: var(--text-base); font-weight: var(--weight-semibold); }
  .subcategory-heading p { color: var(--text-secondary); font-size: var(--text-xs); margin-top: 0.2rem; }
  .icon-button { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: 0; border-radius: var(--radius-sm); background: transparent; color: var(--text-secondary); flex-shrink: 0; padding: 0; }
  .icon-button:hover { background: var(--bg-tertiary); color: var(--text-primary); }
  .subcategory-links { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.45rem 1rem; }
  .subcategory-links a { display: flex; align-items: center; justify-content: space-between; gap: 0.4rem; padding: 0.6rem 0.65rem; border-radius: var(--radius-sm); background: var(--bg-secondary); color: var(--text-primary); font-size: var(--text-xs); }
  .subcategory-links a:hover { color: var(--color-primary); background: var(--color-primary-light); text-decoration: none; }
  .subcategory-links a :global(svg) { flex-shrink: 0; }
  .browse-all { display: inline-flex; align-items: center; gap: 0.7rem; color: var(--color-primary); font-size: var(--text-xs); font-weight: var(--weight-semibold); margin-top: 1.2rem; }
  .search-handoff { display: flex; align-items: flex-start; gap: 0.8rem; border: 1px solid var(--border-default); border-left: 3px solid var(--color-primary); border-radius: var(--radius-md); background: var(--bg-surface); padding: 1rem; margin-bottom: 1.5rem; }
  .search-handoff > :global(svg) { flex-shrink: 0; color: var(--color-primary); }
  .search-handoff > div { flex: 1; }
  .search-handoff strong { font-size: var(--text-sm); }
  .search-handoff p { font-size: var(--text-sm); margin: 0.25rem 0; }
  .search-handoff small { color: var(--text-secondary); font-size: var(--text-xs); }
  .content-footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1.6rem; color: var(--text-secondary); font-size: 0.65rem; }
  .content-footer > span:last-child { font-family: 'Times New Roman', Times, serif; font-size: 1.1rem; color: var(--color-accent); }
  .content-footer > span:last-child > span { color: var(--color-primary); }
  .content-footer > span:last-child > .list-word { color: var(--color-sage); }
  .utility-dialog { color: var(--text-primary); background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-xl); padding: 1.7rem; width: min(460px, calc(100% - 2rem)); max-height: calc(100dvh - 3rem); box-shadow: var(--shadow-lg); }
  .utility-dialog::backdrop { background: color-mix(in srgb, var(--text-primary) 40%, transparent); backdrop-filter: blur(3px); }
  .dialog-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
  .dialog-icon { display: grid; place-items: center; width: 45px; height: 45px; background: var(--color-primary-light); color: var(--color-primary); border-radius: var(--radius-lg); }
  .utility-dialog h2 { font-size: var(--text-2xl); line-height: var(--leading-tight); letter-spacing: -0.03em; }
  .utility-dialog > p { color: var(--text-secondary); font-size: var(--text-sm); margin-top: 0.65rem; }
  .location-search { display: flex; align-items: center; gap: 0.65rem; border: 1px solid var(--border-default); padding: 0.75rem; border-radius: var(--radius-md); color: var(--text-secondary); margin-top: 1.25rem; }
  .location-search input { width: 100%; min-width: 0; border: 0; background: transparent; color: var(--text-primary); font-size: var(--text-sm); }
  .location-search input::placeholder { color: var(--text-secondary); }
  .utility-dialog .picker-label { font-size: var(--text-xs); font-weight: var(--weight-semibold); margin: 1.25rem 0 0.5rem; }
  .location-results { display: grid; gap: 0.2rem; max-height: 280px; overflow-y: auto; padding: 0.2rem; }
  .location-results button { display: flex; align-items: center; justify-content: space-between; gap: 0.7rem; width: 100%; border: 0; border-radius: var(--radius-sm); padding: 0.75rem 0.5rem; background: transparent; color: var(--text-primary); font-size: var(--text-sm); }
  .location-results button:hover { background: var(--color-primary-light); color: var(--color-primary); }
  .location-results button > span { display: flex; align-items: center; gap: 0.6rem; }
  .location-results small { color: var(--text-secondary); font-size: var(--text-xs); }
  .empty-locations { font-size: var(--text-sm); color: var(--text-secondary); padding: 0.75rem 0; }

  @media (max-width: 1100px) {
    .page-shell { padding: 0 1.75rem; }
    .page-layout { grid-template-columns: 210px minmax(0, 1fr); gap: 1.5rem; }
    .category-tile { padding: 1rem; }
    .category-description { font-size: 0.65rem; }
    .subcategory-links { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 850px) {
    .page-shell { padding: 0 1.5rem; }
    .page-layout { grid-template-columns: minmax(0, 1fr); gap: 1.5rem; }
    main { margin: 0; }
    .sidebar { display: grid; grid-template-columns: 1fr 1fr; align-items: stretch; }
    .location-card { display: flex; }
    .area-map { width: 30%; min-width: 65px; height: auto; border-bottom: 0; border-right: 1px solid var(--border-subtle); }
    .area-map > span { display: none; }
    .location-card-content { padding: 1rem; flex: 1; }
    .post-card { padding: 1rem; }
    .post-card p { display: none; }
    .settings-tile { grid-column: 1 / -1; padding: 0.75rem 1rem; }
    .post-card h2 { font-size: var(--text-base); margin-top: 0.1rem; }
    .post-card button { margin-top: 1rem; }
    .intro { padding-top: 0.4rem; padding-bottom: 2rem; }
  }
  @media (max-width: 540px) {
    .page-shell { padding: 0 1rem; }
    .breadcrumb { padding: 1rem 0; }
    .sidebar { gap: 0.7rem; }
    .area-map { display: none; }
    .location-card-content { padding: 0.85rem; }
    .location-card h2 { font-size: var(--text-base); }
    .eyebrow { font-size: 0.55rem; }
    .area-note { display: none; }
    .change-location { margin-top: 0.7rem; padding: 0.5rem; font-size: 0.65rem; }
    .post-card { padding: 0.85rem; display: flex; flex-direction: column; justify-content: space-between; }
    .post-card h2 { font-size: var(--text-sm); }
    .post-card button { margin-top: 0.7rem; padding: 0.55rem; gap: 0.3rem; font-size: 0.65rem; }
    .intro > p { font-size: var(--text-xs); max-width: 270px; line-height: var(--leading-relaxed); }
    .local-label { font-size: 0.55rem; letter-spacing: 0.08em; }
    .category-grid { gap: 0.65rem; }
    .category-rows { gap: 0.65rem; }
    .category-tile { min-height: 133px; padding: 0.8rem; }
    .category-icon { width: 34px; height: 34px; }
    .category-icon :global(svg) { width: 22px; height: 22px; }
    .tile-top { margin-bottom: 0.8rem; }
    .tile-arrow { display: none; }
    .category-title { font-size: var(--text-xs); letter-spacing: -0.025em; }
    .category-description { font-size: 0.57rem; line-height: var(--leading-normal); }
    .subcategory-panel { padding: 1rem; }
    .subcategory-links { grid-template-columns: 1fr; }
    .content-footer { font-size: 0.6rem; }
    .utility-dialog { padding: 1.25rem; }
  }
  @media (prefers-reduced-motion: reduce) { .category-tile { transition: none; } .category-tile:hover { transform: none; } }
</style>
