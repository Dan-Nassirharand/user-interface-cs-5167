<script>
  import SockLinerSwitch from "./lib/SockLinerSwitch.svelte";
  import AgletColorSelector from "./lib/AgletColorSelector.svelte";
  import PowerControl from "./lib/PowerControl.svelte";
  import ActivityButtons from "./lib/ActivityButtons.svelte";
  import sockLinerSketch from "../design/sketching/hybrid-sketch/sock-liner.png";
  import shoeColorSketch from "../design/sketching/hybrid-sketch/shoe-color.png";
  import movementBoostSketch from "../design/sketching/hybrid-sketch/movement-boost.png";

  let showInfo = $state(false);
  let sockLinerOn = $state(false);
  let agletColor = $state("#e5490b");
  let mode = $state("single");
  let activity = $state("none");
  let value = $state(50);

  // percentage points per second at a 1x rate; negative = drain, positive = charge
  const ratesByMode = {
    single: { walk: -1, run: -1.5 },
    double: { walk: -2, run: -2.5 },
    refresh: { walk: 1, run: 1.5 },
  };
  const baseRate = 15;

  $effect(() => {
    if (activity === "none") return;

    const multiplier = ratesByMode[mode][activity];
    const intervalMs = 100;
    const step = baseRate * multiplier * (intervalMs / 1000);

    const id = setInterval(() => {
      value = Math.min(100, Math.max(0, value + step));
    }, intervalMs);

    return () => clearInterval(id);
  });
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
    <div class="sketch-list">
      <div class="placement-graphic">
        <img
          src={sockLinerSketch}
          alt="Placement sketch for the sock liner switch"
        />
      </div>

      <div class="placement-graphic">
        <img
          src={shoeColorSketch}
          alt="Placement sketch for the aglet color selector"
        />
      </div>

      <div class="placement-graphic">
        <img
          src={movementBoostSketch}
          alt="Placement sketch for the power control"
        />
      </div>
    </div>

    <ActivityButtons bind:activity />

    <button
      class="info-button"
      aria-expanded={showInfo}
      onclick={() => (showInfo = !showInfo)}
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
    <div class="control-list">
      <SockLinerSwitch bind:isOn={sockLinerOn} />
      <AgletColorSelector bind:selectedColor={agletColor} />
      <PowerControl {value} {sockLinerOn} ringColor={agletColor} bind:mode />
    </div>
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

  .sketch-list {
    display: grid;
    grid-template-rows: repeat(3, 190px);
    margin-bottom: 16px;
  }

  .placement-graphic {
    display: flex;
    align-items: center;
    border: 1px dashed rgba(247, 247, 247, 0.6);
    padding: 8px;
    text-align: center;
  }

  .placement-graphic img {
    display: block;
    width: 100%;
    height: 160px;
    object-fit: cover;
    /* crops evenly from top and bottom */
    object-position: center;
  }

  .info-button {
    margin-top: 32px;
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
    align-items: center;
    justify-content: center;
  }

  .control-list {
    display: grid;
    grid-template-rows: repeat(3, 190px);
    justify-items: center;
    align-items: center;
  }
</style>
