<script>
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { prefersReducedMotion } from 'svelte/motion';

  let {
    word,
    description, // Becomes definition 1
    color = "inherit",
    pronunciation, // e.g. "/faɪnd/"
    partOfSpeech, // e.g. "verb"
    definitions = [], // Optional extra definitions after the description
  } = $props();

  // Drop a trailing period for the headword ("Find." -> "Find")
  let headword = $derived(word.replace(/\.$/, ""));
  let senses = $derived([description, ...definitions].filter(Boolean));

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
        <p class="headword" style="color: {color};">{headword}</p>
        {#if pronunciation || partOfSpeech}
          <p class="meta">
            {#if pronunciation}<span>{pronunciation}</span>{/if}
            {#if pronunciation && partOfSpeech}<span aria-hidden="true"> · </span>{/if}
            {#if partOfSpeech}<span class="pos">{partOfSpeech}</span>{/if}
          </p>
        {/if}
        {#if senses.length}
          <ol class="definitions">
            {#each senses as sense}
              <li>{sense}</li>
            {/each}
          </ol>
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
    /* Long entries scroll instead of spilling past max-height */
    overflow-y: auto;
    padding: 1rem 1.25rem;
    text-align: left;
    background: #ffffff;
    border: 1px solid var(--border-default, #cbd5e1);
    border-radius: var(--radius-lg, 12px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  /* Card is always white, so text uses fixed greys rather than the theme's text colors */

  .headword {
    margin: 0;
    font-family: "Times New Roman", Times, serif;
    font-size: var(--text-2xl, 1.5rem);
    line-height: 1.2;
  }

  /* Pronunciation · PART OF SPEECH */
  .meta {
    margin: 0.125rem 0 0.75rem;
    font-size: var(--text-xs, 0.75rem);
    color: #64748b;
  }

  .pos {
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .definitions {
    margin: 0;
    padding-left: 1.25rem;
    font-size: var(--text-sm, 0.875rem);
    line-height: 1.5;
    color: #475569;
  }

  .definitions li + li {
    margin-top: 0.25rem;
  }
</style>
