<script>
  import SockLinerSwitch from "./lib/SockLinerSwitch.svelte";
  import AgletColorSelector from "./lib/AgletColorSelector.svelte";
  import PowerControl from "./lib/PowerControl.svelte";

  let showInfo = false;
  let sockLinerOn = $state(false);
</script>

<div class="layout">
  <header class="header">
    <h1 class="title">Smart Shoes</h1>
    <span class="author">Dan Nassirharand</span>
    <a
      class="writeup-link"
      href="./design/README.md"
      target="_blank"
      rel="noopener"
    >
      Project Write-Up
    </a>
  </header>

  <aside class="sidebar">
    <div class="placement-graphic">
      <!-- TODO: replace with a graphic showing where this UI lives on the physical object.  Maybe back to hybrid sketches? -->
      Placement Graphic
    </div>

    <button
      class="info-button"
      aria-expanded={showInfo}
      on:click={() => (showInfo = !showInfo)}
    >
      <span aria-hidden="true">ⓘ</span> Info
    </button>

    {#if showInfo}
      <p class="info-panel">
        <!-- TODO: explain the controls for simulating the object's use -->
        TODO: explain how to use the simulated controls here.
      </p>
    {/if}
  </aside>

  <main class="main">
    <SockLinerSwitch bind:isOn={sockLinerOn} />
    <AgletColorSelector />
    <PowerControl value={50} {sockLinerOn} />
  </main>
</div>

<style>
  /* TODO: add :root for specific values you like (mainly thinking color) */
  .layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "header header"
      "sidebar main";
    height: 100vh;
  }

  .header {
    grid-area: header;
    display: flex;
    align-items: baseline;
    gap: 16px;
    background: #222;
    color: rgb(247, 247, 247);
    padding: 12px 16px;
  }

  .title {
    margin: 0;
    font-size: 1.1rem;
  }

  .writeup-link {
    margin-left: auto;
    color: inherit;
  }

  .sidebar {
    grid-area: sidebar;
    background: #e5490b;
    color: rgb(247, 247, 247);
    padding: 16px;
  }

  .placement-graphic {
    border: 1px dashed rgba(247, 247, 247, 0.6);
    padding: 24px 8px;
    text-align: center;
    margin-bottom: 16px;
  }

  .info-button {
    cursor: pointer;
  }

  .info-panel {
    margin-top: 12px;
    font-size: 0.9rem;
  }

  .main {
    grid-area: main;
    background: #eee;
    padding: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 48px;
  }
</style>
