<script>
  let { word, color = "inherit" } = $props();

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
      <div class="card"></div>
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
    height: 10rem;
    background: #ffffff;
    border: 1px solid var(--border-default, #cbd5e1);
    border-radius: var(--radius-lg, 12px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
</style>
