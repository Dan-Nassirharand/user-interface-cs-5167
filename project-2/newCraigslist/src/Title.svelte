<script>
  let { text = "craigslist", href = "/", showLogo = false } = $props();
</script>

<h1 class="title">
  <a {href}>
    {#if showLogo}
      <img class="logo" src="/static/logo.png" alt="" />
    {/if}
    {text}
  </a>
</h1>

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
