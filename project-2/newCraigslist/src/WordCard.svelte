<script>
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { prefersReducedMotion } from 'svelte/motion';

  let { word, description, color = "inherit" } = $props();

  let hovered = $state(false);
  let pinned = $state(false); // Clicked open; stays open until clicked again or dismissed
  let wrapper;

  let open = $derived(hovered || pinned);

  function handleWindowClick(e) {
    if (pinned && !wrapper.contains(e.target)) pinned = false;
  }

  function handleKeydown(e) {
    if (e.key === "Escape") pinned = false;
  }
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleKeydown} />

<span
  class="word-card"
  bind:this={wrapper}
  role="presentation"
  onmouseenter={() => (hovered = true)}
  onmouseleave={() => (hovered = false)}
>
  <button
    type="button"
    class="word"
    style="color: {color};"
    aria-expanded={open}
    onclick={() => (pinned = !pinned)}
  >
    {word}
  </button>

  {#if open}
    <!-- Padding (not margin) bridges the gap so the mouse can move onto the card without it closing -->
    <div class="card-area">
      <!-- Fade + drop in; same in reverse (a bit faster) on close -->
      <div
        class="card"
        in:fly={{ y: -8, duration: prefersReducedMotion.current ? 0 : 180, easing: cubicOut }}
        out:fly={{ y: -8, duration: prefersReducedMotion.current ? 0 : 120, easing: cubicOut }}
      >
        <p class="card-word" style="color: {color};">{word.substring(0, word.indexOf('.'))}</p>
        {#if description}
          <p class="card-description">{description}</p>
        {/if}
      </div>
    </div>
  {/if}
</span>

<style>
  .word-card {
    position: relative;
    display: inline-block;
  }

  .word {
    padding: 0;
    font-family: "Times New Roman", Times, serif;
    font-size: var(--text-2xl, 1.25rem);
    background: none;
    border: none;
    cursor: pointer;
    /* Underline matches the word's color */
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }

  .card-area {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    padding-top: 0.5rem;
  }

  .card {
    width: 16rem;
    /* Grows if a description runs long instead of overflowing */
    min-height: 5rem;
    max-height: 10rem;
    padding: 1rem 1.25rem;
    text-align: center;
    background: #ffffff;
    border: 1px solid var(--border-default, #cbd5e1);
    border-radius: var(--radius-lg, 12px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .card-word {
    margin: 0 0 0.5rem;
    font-family: "Times New Roman", Times, serif;
    font-size: var(--text-2xl, 1.5rem);
  }

  .card-description {
    margin: 0 0 0.5rem;
    font-size: var(--text-sm, 0.875rem);
    line-height: 1.5;
    /* Card is always white, so use a fixed dark grey rather than the theme's text color */
    color: #475569;
  }
</style>
