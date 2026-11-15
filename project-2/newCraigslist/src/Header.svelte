<script>
  import LocationIcon from './LocationIcon.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import SettingsPanel from './SettingsPanel.svelte';
  import SearchBar from './SearchBar.svelte';

  let {
    query = '',
    onsearch,
    dark = $bindable(false),
    locationHref = '/location',
    location = { city: 'Cincinnati', state: 'Ohio' },
    locations = [],
    accountProfile = null,
    onsettings,
    onlocationselect,
    searchPlaceholder = 'Search craigslist',
    searchLabel = 'Search craigslist',
  } = $props();

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

  let profile = $state(readProfile());
  const displayedProfile = $derived(accountProfile || profile);
  let settingsOpen = $state(false);

  function openSettings() {
    if (onsettings) onsettings();
    else settingsOpen = true;
  }

  function saveProfile(nextProfile) {
    try { localStorage.setItem(profileStorageKey, JSON.stringify(nextProfile)); }
    catch { throw new Error('Your settings could not be saved. Browser storage may be full or unavailable. Try a smaller profile photo.'); }
    profile = { ...nextProfile };
    settingsOpen = false;
  }
</script>

<header class="site-header">
  <div class="identity">
    <a class="brand" href="/" aria-label="craigslist home">
      <img src="/static/logo.png" alt="" />
      <span>craigslist</span>
    </a>
    <span class="header-divider" aria-hidden="true"></span>
    {#if onlocationselect}
      <button class="header-location" onclick={onlocationselect} aria-haspopup="dialog">
        <LocationIcon name="pin" size={17} />
        <span>{location.city}</span>
        <span class="city-caret" aria-hidden="true"><LocationIcon name="chevron-down" size={14} /></span>
      </button>
    {:else}
      <a class="header-location" href={locationHref} aria-label={`Back to ${location.city} location page`}>
        <LocationIcon name="pin" size={17} />
        <span>{location.city}</span>
      </a>
    {/if}
  </div>

  <div class="search">
    <SearchBar header initialQuery={query} {onsearch} placeholder={searchPlaceholder} ariaLabel={searchLabel} />
  </div>

  <div class="actions">
    <button class="profile-button" onclick={openSettings} aria-label={displayedProfile.username ? `Account settings for ${displayedProfile.username}` : 'Account settings'} aria-haspopup="dialog">
      {#if displayedProfile.avatar}<img src={displayedProfile.avatar} alt="" />{:else}<LocationIcon name="user" size={22} />{/if}
    </button>
    <ThemeToggle inline bind:dark />
  </div>
</header>

{#if !onsettings}
  <SettingsPanel open={settingsOpen} {profile} {locations} {dark} onsave={saveProfile} onclose={() => settingsOpen = false} onthemechange={(value) => dark = value} />
{/if}

<style>
  .site-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    min-height: 88px;
    padding: 1rem 3rem;
    border-bottom: 1px solid var(--border-subtle);
    background: var(--bg-surface);
  }
  button { font: inherit; }
  button { cursor: pointer; }
  button, a { -webkit-tap-highlight-color: transparent; }
  button:focus-visible, a:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 3px; }
  /* Reserve the previous identity block's width to keep the results search in place. */
  .identity { display: flex; align-items: center; flex-shrink: 0; gap: 1.5rem; padding-right: 2.4rem; }
  .brand { display: inline-flex; align-items: center; flex-shrink: 0; color: var(--text-primary); font-family: 'Times New Roman', Times, serif; font-size: 2.2rem; line-height: 1; letter-spacing: -0.06rem; }
  .brand:hover { color: var(--text-primary); text-decoration: none; }
  /* Preserve the full logo; these margins compensate for its transparent sides. */
  .brand img { height: 1em; width: auto; object-fit: contain; margin-left: -0.204em; margin-right: -0.004em; }
  .header-divider { height: 28px; width: 1px; background: var(--border-subtle); }
  .header-location { position: relative; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; border: 0; background: none; color: var(--text-secondary); font-size: var(--text-sm); white-space: nowrap; }
  .header-location:hover { color: var(--color-primary); text-decoration: none; }
  .city-caret { position: absolute; right: -1.375rem; display: flex; }
  .search { flex: 1; max-width: 40rem; min-width: 0; margin-left: auto; }
  .actions { display: flex; align-items: center; gap: 0.5rem; margin-left: auto; }
  .profile-button { display: grid; place-items: center; width: 40px; height: 40px; flex-shrink: 0; overflow: hidden; padding: 0; border: 1px solid var(--border-default); border-radius: var(--radius-full); color: var(--text-secondary); background: var(--bg-surface); }
  .profile-button:hover { color: var(--color-primary); border-color: var(--color-primary); background: var(--color-primary-light); }
  .profile-button img { width: 100%; height: 100%; object-fit: cover; }
  @media (max-width: 900px) {
    .site-header { flex-wrap: wrap; gap: 1rem; min-height: 0; padding: 1rem; }
    .identity { display: contents; padding-right: 0; }
    .brand { font-size: 2rem; }
    .header-divider { display: none; }
    .search { order: 3; flex-basis: 100%; max-width: none; margin: 0; }
  }
  @media (max-width: 540px) {
    .site-header { gap: 0.75rem; }
    .brand { font-size: 1.75rem; }
    .header-location { order: 2; flex-basis: 100%; padding: 0; font-size: var(--text-xs); }
    .city-caret { position: static; }
  }
</style>
