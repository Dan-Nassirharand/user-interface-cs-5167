<script>
  import { onMount } from 'svelte';

  const PERCENT_PURPLE = 0.75;
  const PERCENT_BLUE = 0.125;
  const PERCENT_GREEN = 0.125;

  const suggestions = [
    "Try: A blue rose in Cincinnati",
    "Try: Librarian Jobs near me",
    "Try: Dogwalking gigs",
    "Try: Used cars",
    "Try: Getting your UI fixed",
    "Try: Find a Computer Graphics Professor",
    "Try: Volunteering events near me",
    "Try: Sell my ram",
    "Try: Find a new CEO",
    "Try: Used Bikes",
    "Try: Professional Cameras",
  ];

  const colors = [
    "var(--color-primary, #5c2d91)", // Purple
    "var(--color-accent, #2563eb)",  // Blue
    "var(--color-sage, #8a9a86)"     // Green
  ];

  let currentSuggestion = suggestions[0];
  let currentColor = colors[0];
  let copied = false;
  let timeoutId;

  function pickRandom() {
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    currentSuggestion = suggestions[randomIndex];

    const rand = Math.random();
    if (rand < PERCENT_PURPLE) {
      currentColor = colors[0];
    } else if (rand < PERCENT_PURPLE + PERCENT_BLUE) {
      currentColor = colors[1];
    } else {
      currentColor = colors[2];
    }
  }

  onMount(() => {
    pickRandom();
  });

  async function handleCopy() {
    const textToCopy = currentSuggestion.replace(/^Try:\s*/i, '');

    try {
      await navigator.clipboard.writeText(textToCopy);
      copied = true;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }
</script>

<button
  type="button"
  class="suggestion-inline"
  style="--item-color: {currentColor};"
  on:click={handleCopy}
  aria-label="Copy suggestion to clipboard"
>
  {currentSuggestion}

  {#if copied}
    <span class="copied-badge" role="status">Copied!</span>
  {/if}
</button>

<style>
  .suggestion-inline {
    all: unset;
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    align-self: start;
    justify-self: center;
    font-family: var(--font-sans);
    font-size: var(--text-base);
    font-weight: var(--weight-medium);
    line-height: var(--leading-none);
    color: var(--item-color);
    cursor: pointer;
    transition: var(--theme-transition), opacity 0.15s ease, transform 0.1s ease;
  }

  .suggestion-inline:focus-visible {
    outline: 2px solid var(--item-color);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .suggestion-inline:hover {
    opacity: 0.75;
  }

  .suggestion-inline:active {
    transform: scale(0.98);
  }

  .copied-badge {
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--text-primary);
    color: var(--text-inverse);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-none);
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);
    animation: popUp 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .copied-badge::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 4px;
    border-style: solid;
    border-color: var(--text-primary) transparent transparent transparent;
  }

  @keyframes popUp {
    from {
      opacity: 0;
      transform: translate(-50%, 4px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0) scale(1);
    }
  }
</style>
