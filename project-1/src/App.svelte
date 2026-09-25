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
  /** @type {"single" | "double" | "refresh"} */
  let mode = $state("single");
  /** @type {"none" | "walk" | "run"} */
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
    <section class="sidebar-section">
      <h2 class="section-title">UI Placement</h2>

      <div class="sketch-list">
        <div class="sketch-item">
          <h3 class="item-title">Sock Liner Color</h3>
          <div class="placement-graphic">
            <img
              src={sockLinerSketch}
              alt="Placement sketch for the sock liner switch"
            />
          </div>
        </div>

        <div class="sketch-item">
          <h3 class="item-title">Aglet Color Selector</h3>
          <div class="placement-graphic">
            <img
              src={shoeColorSketch}
              alt="Placement sketch for the aglet color selector"
            />
          </div>
        </div>

        <div class="sketch-item">
          <h3 class="item-title">Power Control</h3>
          <div class="placement-graphic">
            <img
              src={movementBoostSketch}
              alt="Placement sketch for the power control"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="sidebar-section">
      <h2 class="section-title">Action Buttons</h2>

      <ActivityButtons bind:activity />

      <button
        class="info-button"
        aria-expanded={showInfo}
        onclick={() => (showInfo = !showInfo)}
      >
        <span aria-hidden="true">ⓘ</span> Info
      </button>
    </section>
  </aside>

  <main class="main">
    <div class="control-list">
      <div class="control-item">
        <h3 class="item-title">Sock Liner Color</h3>
        <div class="control-row">
          <SockLinerSwitch bind:isOn={sockLinerOn} />
          {#if showInfo}
            <p class="control-info">
              Double-click to toggle sock liner between white/black. Inner Power
              Control color matches that of the sock liner.
            </p>
          {/if}
        </div>
      </div>

      <div class="control-item">
        <h3 class="item-title">Aglet Color Selector</h3>
        <div class="control-row">
          <AgletColorSelector bind:selectedColor={agletColor} />
          {#if showInfo}
            <p class="control-info">
              Controls the color of the shoe. Present when aglets are
              magnetically bound. Power Control ring color matches the color of
              the shoe.
            </p>
          {/if}
        </div>
      </div>

      <div class="control-item">
        <h3 class="item-title">Power Control</h3>
        <div class="control-row">
          <PowerControl
            {value}
            {sockLinerOn}
            ringColor={agletColor}
            bind:mode
          />
          {#if showInfo}
            <p class="control-info">
              Displays the current power mode and remaining energy. Click to
              cycle through Power I, Power II, and Recharge modes.
            </p>
          {/if}
        </div>
      </div>
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

  .sidebar-section + .sidebar-section {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid rgba(247, 247, 247, 0.4);
  }

  .section-title {
    margin: 0 0 16px;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .sketch-list {
    display: grid;
    grid-template-rows: repeat(3, 220px);
    row-gap: 16px;
  }

  .sketch-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
  }

  .item-title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    text-align: center;
  }

  .placement-graphic {
    display: flex;
    align-items: center;
    flex: 1;
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
    grid-template-rows: repeat(3, minmax(220px, auto));
    row-gap: 16px;
    justify-items: center;
  }

  .control-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    height: 100%;
  }

  .control-item .item-title {
    color: #000;
  }

  .control-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .control-info {
    max-width: 220px;
    margin: 0;
    font-size: 0.85rem;
    color: #333;
    text-align: left;
  }
</style>
