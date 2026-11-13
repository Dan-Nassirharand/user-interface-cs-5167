<script>
  import { onMount } from 'svelte';

  // Configuration
  // Make the other colors rare hehehe
  const PERCENT_PURPLE = 0.8;
  const PERCENT_BLUE = 0.1;
  const PERCENT_GREEN = 0.1;

  // How long "Copied" shows before reverting to the suggestion (ms)
  const FEEDBACK_MS = 1000;

  const suggestions = [
    "Try: A blue rose in Cincinnati"
    // add more here
  ];

  const colors = [
    "var(--color-primary, #5c2d91)", // Purple
    "var(--color-accent, #2563eb)",  // Blue
    "var(--color-sage, #8a9a86)"     // Green
  ];

  const weights = [PERCENT_PURPLE, PERCENT_BLUE, PERCENT_GREEN];

  function pickWeighted(weights) {
    const total = weights.reduce((sum, w) => sum + w, 0);
    let roll = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      roll -= weights[i];
      if (roll < 0) return i;
    }
    return 0;
  }

  // Deterministic defaults so server and client render the same HTML
  let text = suggestions[0];
  let colorIndex = 0;
  let status = 'idle'; // 'idle' | 'copied' | 'failed'
  let timer;

  // Randomize only after mount to avoid hydration mismatches
  onMount(() => {
    text = suggestions[Math.floor(Math.random() * suggestions.length)];
    colorIndex = pickWeighted(weights);
    return () => clearTimeout(timer);
  });

  function reset() {
    clearTimeout(timer);
    status = 'idle';
  }

  // Fallback for non-secure contexts where navigator.clipboard is missing
  function legacyCopy(value) {
    const el = document.createElement('textarea');
    el.value = value;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    document.body.removeChild(el);
    return ok;
  }

  async function copyPrompt() {
    // Copy the prompt itself, without the "Try: " label
    const prompt = text.replace(/^Try:\s*/i, '');
    let ok = false;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(prompt);
        ok = true;
      } catch (err) {
        console.error('Clipboard API failed, trying fallback:', err);
      }
    }
    if (!ok) ok = legacyCopy(prompt);

    status = ok ? 'copied' : 'failed';
    clearTimeout(timer);
    timer = setTimeout(reset, FEEDBACK_MS);
  }
</script>

<button
  type="button"
  class="suggestion"
  class:active={status !== 'idle'}
  style:color={colors[colorIndex]}
  on:click={copyPrompt}
  on:mouseleave={reset}
  on:blur={reset}
  aria-label={`Copy prompt: ${text.replace(/^Try:\s*/i, '')}`}
>
  <span class="label">{text}</span>
  <span class="feedback" role="status" aria-live="polite">
    {#if status === 'copied'}✓ Copied{:else if status === 'failed'}Copy failed{/if}
  </span>
</button>

<style>
  .suggestion {
    /* Both children share one grid cell, so size never changes */
    display: inline-grid;
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    text-align: left;
    cursor: pointer;
    font-size: var(--text-base, 1.0rem);
    font-weight: var(--weight-medium, 500);
    font-family: "Times New Roman", Times, serif;
    line-height: 1.25;
  }

  .label,
  .feedback {
    grid-area: 1 / 1;
    transition: opacity 0.15s ease;
  }

  .feedback {
    font-weight: var(--weight-semibold, 600);
    opacity: 0;
  }

  .active .label {
    opacity: 0;
  }

  .active .feedback {
    opacity: 1;
  }

  .suggestion:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    .label,
    .feedback {
      transition: none;
    }
  }
</style>