<script>
  import SearchModeSelect from './SearchModeSelect.svelte';
  import searchIcon from './assets/icons/search2.svg?raw';

  const placeholders = {
    search: "Search craigslist",
    location: "Find your city",
  };

  let mode = $state("search");
  let {
    onsearch,
    initialQuery = '',
    header = false,
    modeToggle = true,
    placeholder,
    ariaLabel = 'Search',
  } = $props();
  const showModeToggle = $derived(modeToggle && !header);
  let query = $state('');
  let searchInput = $state(null);
  $effect(() => { query = initialQuery; searchInput?.setCustomValidity(''); });
  $effect(() => { mode; searchInput?.setCustomValidity(''); });

  function submit(event) {
    event.preventDefault();
    const input = event.currentTarget.querySelector('input');
    input.setCustomValidity('');
    const error = onsearch?.(query.trim(), showModeToggle ? mode : 'search');
    if (typeof error === 'string' && error) {
      input.setCustomValidity(error);
      input.reportValidity();
    }
  }
</script>

<form class="search-bar" class:header role="search" onsubmit={submit}>
  {#if showModeToggle}
    <SearchModeSelect bind:value={mode} />
  {:else}
    <span class="search-icon" aria-hidden="true">{@html searchIcon}</span>
  {/if}
  <input bind:this={searchInput} bind:value={query} type="search" placeholder={placeholder ?? placeholders[showModeToggle ? mode : 'search']} aria-label={ariaLabel} oninput={(event) => event.currentTarget.setCustomValidity('')} />
  <button type="submit">Search</button>
</form>

<style>
  .search-bar {
    display: flex;
    width: min(100%, 40rem);
  }

  /* The input sets the bar's height (padding + font size); the mode select and button stretch to match */
  input {
    width: 100%;
    min-width: 0;
    padding: 0.625rem 1rem;
    font-size: var(--text-lg, 1.125rem);
    border: 1px solid var(--border-default, #cbd5e1);
    /* Square on both sides: joined to the mode select and the search button */
    border-radius: 0;
    background: var(--bg-secondary, #f8fafc);
    color: var(--text-secondary, #f8fafc);
  }

  input:hover {
    background: var(--bg-surface-hover);
  }

  button {
    padding: 0.625rem 1.25rem;
    font-size: var(--text-lg, 1.125rem);
    /* Same 1px outline as the input so the edges line up; the input's right border forms the seam */
    border: 1px solid var(--border-default, #cbd5e1);
    border-left: none;
    /* Square left corners where it joins the search input */
    border-radius: 0 var(--radius-md, 8px) var(--radius-md, 8px) 0;
    background: var(--color-primary, #5c2d91);
    color: var(--color-primary-contrast, #ffffff);
    cursor: pointer;
    transition: var(--theme-transition), filter 0.15s;
  }

  button:hover {
    filter: brightness(1.1);
  }

  .search-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2.75rem;
    border: 1px solid var(--border-default, #cbd5e1);
    border-right: none;
    border-radius: var(--radius-md, 8px) 0 0 var(--radius-md, 8px);
    background: var(--bg-secondary, #f8fafc);
    color: var(--text-secondary, #475569);
  }

  .search-icon :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
    stroke: currentColor;
  }

  .header {
    width: 100%;
    min-height: 50px;
    border-radius: var(--radius-md, 8px);
  }

  .header input,
  .header button {
    font-size: var(--text-sm, 0.875rem);
  }

  .header input {
    padding: 0.625rem 0.75rem;
  }

  .header input:focus {
    outline: none;
    box-shadow: none;
  }

  .header:focus-within {
    outline: 2px solid var(--color-primary, #5c2d91);
    outline-offset: 2px;
  }

  @media (max-width: 540px) {
    .header button { padding-inline: 0.875rem; }
  }
</style>
