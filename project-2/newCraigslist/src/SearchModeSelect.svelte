<script>
  import searchIcon from './assets/icons/search2.svg?raw';
  import locationIcon from './assets/icons/location4.svg?raw';
  import upCaret from './assets/icons/upCaret.svg?raw';
  import downCaret from './assets/icons/downCaret.svg?raw';

  let { value = $bindable("search") } = $props();

  let open = $state(false);
  let wrapper;

  const options = [
    { value: "search", label: "Search", icon: searchIcon },
    { value: "location", label: "Location", icon: locationIcon },
  ];

  let current = $derived(options.find((o) => o.value === value) ?? options[0]);

  function choose(optionValue) {
    value = optionValue;
    open = false;
  }

  function handleWindowClick(e) {
    if (open && !wrapper.contains(e.target)) open = false;
  }

  function handleKeydown(e) {
    if (e.key === "Escape") open = false;
  }
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleKeydown} />

{#snippet icon(svg, className = "icon")}
  <span class={className} aria-hidden="true">{@html svg}</span>
{/snippet}

<div class="mode-select" bind:this={wrapper}>
  <button
    type="button"
    class="trigger"
    aria-label="Search mode"
    aria-haspopup="listbox"
    aria-expanded={open}
    onclick={() => (open = !open)}
  >
    {@render icon(current.icon)}
    {@render icon(open ? upCaret : downCaret, "caret")}
  </button>

  {#if open}
    <ul class="menu" role="listbox" aria-label="Search mode">
      {#each options as option}
        <li>
          <button
            type="button"
            role="option"
            aria-selected={value === option.value}
            onclick={() => choose(option.value)}
          >
            {@render icon(option.icon)}
            {option.label}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .mode-select {
    position: relative;
    display: flex;
  }

  button {
    font: inherit;
    color: var(--text-primary, #0f172a);
    cursor: pointer;
  }

  .trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0 0.5rem;
    font-size: var(--text-base, 1rem);
    background: #ffffff;
    color: #0f172a;
    border: 1px solid var(--border-default, #cbd5e1);
    /* Square right side where it joins the search input; the input's border forms the seam */
    border-right: none;
    border-radius: var(--radius-md, 8px) 0 0 var(--radius-md, 8px);
    transition: background-color 0.15s;
  }

  .trigger:hover {
    /* Same grey as the hovered menu options */
    background: #e2e8f0;
  }

  .icon,
  .caret {
    display: inline-flex;
    flex-shrink: 0;
  }

  .icon {
    /* The downloaded icons have built-in padding, so size up to compensate */
    width: 1.5em;
    height: 1.5em;
  }

  .caret {
    width: 0.6em;
    height: 0.6em;
  }

  .icon :global(svg),
  .caret :global(svg) {
    width: 100%;
    height: 100%;
  }

  .menu {
    position: absolute;
    top: calc(100% + 0.25rem);
    left: 0;
    z-index: 1;
    margin: 0;
    padding: 0.25rem;
    list-style: none;
    background: #ffffff;
    border: 1px solid var(--border-default, #cbd5e1);
    border-radius: var(--radius-md, 8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .menu button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.4rem 0.75rem;
    font-size: var(--text-sm, 0.875rem);
    white-space: nowrap;
    background: none;
    color: #0f172a;
    border: none;
    border-radius: var(--radius-sm, 4px);
    text-align: left;
  }

  .menu button:hover,
  .menu button:focus-visible {
    background: #e2e8f0;
    outline: none;
  }
</style>
