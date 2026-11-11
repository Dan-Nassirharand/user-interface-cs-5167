<script>
  // App owns the saved theme so the header and settings controls stay in sync.
  let { dark = $bindable(false) } = $props();

  // theme.css switches palettes based on [data-theme] on <html>
  $effect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch { /* Keep the current session usable if storage is unavailable. */ }
  });

  function toggle() {
    dark = !dark;
  }
</script>

<button
  type="button"
  class="toggle"
  class:dark
  role="switch"
  aria-checked={dark}
  aria-label="Dark mode"
  onclick={toggle}
>
  <!-- Both icons are stacked; the current mode's icon is shown -->
  <svg class="icon sun" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
  <svg class="icon moon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
</button>

<style>
  .toggle {
    position: fixed;
    top: 1.25rem;
    right: 1.25rem;
    z-index: 20;
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    color: var(--text-primary, #0f172a);
    background: none;
    border: none;
    cursor: pointer;
  }

  .toggle:focus-visible {
    outline: 2px solid var(--color-accent, #2563eb);
    outline-offset: 2px;
    border-radius: var(--radius-md, 8px);
  }

  .icon {
    grid-area: 1 / 1;
    width: 1.5rem;
    height: 1.5rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: opacity 0.3s, transform 0.3s;
  }

  /* Light mode: sun visible, moon rotated away */
  .moon {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
  }

  .dark .sun {
    opacity: 0;
    transform: rotate(90deg) scale(0.5);
  }

  .dark .moon {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .icon { transition: none; }
  }
</style>
