<script>
  let { text = "craigslist", href = "/", showLogo = false, compact = false } = $props();
</script>

<svelte:element this={compact ? 'p' : 'h1'} class="title" class:compact>
  <a {href}>
    {#if showLogo}
      <img class="logo" src="/static/logo.png" alt="" />
    {/if}
    {text}
  </a>
</svelte:element>

<style>
  .title {
    margin: 0;
    font-family: "Times New Roman", Times, serif;
    font-size: 4rem;
    font-weight: normal;
  }

  .title a {
    display: inline-flex;
    align-items: center;
    color: var(--text-primary, #0f172a);
    text-decoration: none;
    cursor: pointer;
  }

  .compact {
    font-size: 2.6rem;
  }

  @media (max-width: 760px) {
    .compact { font-size: 2rem; }
  }

  .logo {
    /* logo.png has transparent padding on both sides (135 of 860px each).
       Crop it off so the visible logo + text is truly centered,
       then add the same space back as a real gap before the text. */
    height: 1em;
    width: 0.89em;
    object-fit: cover;
    margin-right: 0.2em;
  }
</style>
