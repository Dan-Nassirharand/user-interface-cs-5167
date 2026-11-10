<script>
  import SearchModeSelect from './SearchModeSelect.svelte';

  const placeholders = {
    search: "Search craigslist",
    location: "Find your city",
  };

  let mode = $state("search");
</script>

<form class="search-bar" onsubmit={(e) => e.preventDefault()}>
  <SearchModeSelect bind:value={mode} />
  <input type="search" placeholder={placeholders[mode]} aria-label="Search" />
  <button type="submit">Search</button>
</form>

<style>
  .search-bar {
    display: flex;
  }

  /* The input sets the bar's height (padding + font size); the mode select and button stretch to match */
  input {
    width: 28rem;
    padding: 0.625rem 1rem;
    font-size: var(--text-lg, 1.125rem);
    border: 1px solid var(--border-default, #cbd5e1);
    /* Square on both sides: joined to the mode select and the search button */
    border-radius: 0;
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
    transition: filter 0.15s;
  }

  button:hover {
    filter: brightness(1.1);
  }
</style>
