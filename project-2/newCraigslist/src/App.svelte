<script>
  import HomeBackground from './HomeBackground.svelte';
  import Title from './Title.svelte';
  import SearchBar from './SearchBar.svelte';
  import WordCard from './WordCard.svelte';
  import DictionaryWordCard from './DictionaryWordCard.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import LocationPage from './LocationPage.svelte';

  function readSavedTheme() {
    try { return localStorage.getItem('theme') === 'dark'; }
    catch { return false; }
  }
  let dark = $state(readSavedTheme());

  // Temporary page navigation. A normal visit still opens the existing homepage.
  let page = $state(window.location.hash && window.location.hash !== '#home' ? 'location' : 'home');

  function syncPage() {
    page = window.location.hash && window.location.hash !== '#home' ? 'location' : 'home';
  }
</script>

<svelte:head>{#if page === 'home'}<title>craigslist</title>{/if}</svelte:head>
<svelte:window onhashchange={syncPage} />
<div class:location-theme={page === 'location'}><ThemeToggle bind:dark /></div>

{#if page === 'home'}
<HomeBackground />
<main>
  <div class="header">
    <Title showLogo={true}/>
    <div class="words">
      
      <WordCard word="Find." description="Find housing, jobs, listings, events, and more in your area." color="var(--color-accent)" />
      <WordCard word="Shop." description="Shop everything that craigslist users are selling." color="var(--color-primary)" />
      <WordCard word="List." description="List items, services, and more to users in your area." color="var(--color-sage)" />
     
      <!-- <DictionaryWordCard word="Find." pronunciation="/faɪnd/" partOfSpeech="verb" description="Find housing, jobs, listings, events, and more in your area." color="var(--color-accent)" />
      <DictionaryWordCard word="Shop." pronunciation="/ʃɑp/" partOfSpeech="verb" description="Shop everything that craigslist users are selling." color="var(--color-primary)" />
      <DictionaryWordCard word="List." pronunciation="/lɪst/" partOfSpeech="verb" description="List items, services, and more to users in your area." color="var(--color-sage)" /> -->
    </div>
  </div>
  <SearchBar />
</main>
{:else}
  <LocationPage bind:dark />
{/if}

{#if import.meta.env.DEV}
  <!-- Remove this preview switch once the team's page navigation is connected. -->
  <nav class="page-preview" aria-label="Development page preview">
    <span>Page preview</span>
    <a href="#home" class:active={page === 'home'} aria-current={page === 'home' ? 'page' : undefined}>Home</a>
    <a href="#location" class:active={page === 'location'} aria-current={page === 'location' ? 'page' : undefined}>Location</a>
  </nav>
{/if}

<style>
  .location-theme { position: absolute; top: 0; right: 0; z-index: 20; }
  .location-theme :global(.toggle) { position: absolute; }

  .page-preview {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 30;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.35rem;
    border: 1px solid var(--border-default);
    border-radius: var(--radius-full);
    background: var(--bg-surface);
    box-shadow: var(--shadow-md);
    font-size: var(--text-xs);
  }

  .page-preview span { padding: 0 0.6rem; color: var(--text-secondary); }
  .page-preview a { padding: 0.45rem 0.85rem; color: var(--text-secondary); border-radius: var(--radius-full); }
  .page-preview a:hover { background: var(--bg-tertiary); text-decoration: none; }
  .page-preview a.active { background: color-mix(in srgb, var(--color-primary) 78%, black); color: var(--color-primary-contrast); }
  .page-preview a:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }

  main {
    position: fixed;
    inset: 0;
    /* Equal top and bottom rows put the middle row (the search bar) at the exact center */
    display: grid;
    grid-template-rows: 1fr auto 1fr;
    justify-items: center;
    row-gap: 1.5rem;
    /* Nudge everything slightly below center */
    translate: 0 1.5rem;
  }

  .header {
    align-self: end;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .words {
    display: flex;
    gap: 1.5rem;
  }
</style>
