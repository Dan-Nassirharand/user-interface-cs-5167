<script>
  import SockLinerSwitch from "./lib/SockLinerSwitch.svelte";
  import ShoeColorSelector from "./lib/ShoeColorSelector.svelte";
  import PowerControl from "./lib/PowerControl.svelte";
  import ActivityButtons from "./lib/ActivityButtons.svelte";
  import SimulationControl from "./lib/SimulationControl.svelte";
  import sockLinerSketch from "./assets/sock-liner.png";
  import shoeColorSketch from "./assets/shoe-color.png";
  import movementBoostSketch from "./assets/movement-boost.png";

  let showInfo = $state(false);
  let sockLinerOn = $state(false);
  let shoeColor = $state("#e5490b");
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

    <div class="header-actions">
      <ActivityButtons bind:activity />

      <SimulationControl
        bind:sockLinerOn
        bind:shoeColor
        bind:activity
        bind:mode
      />

      <button
        class="info-button"
        aria-expanded={showInfo}
        onclick={() => (showInfo = !showInfo)}
      >
        <span aria-hidden="true">ⓘ</span> Info
      </button>
    </div>

    <a
      class="writeup-link"
      href="./design/README.md"
      target="_blank"
      rel="noopener"
    >
      Project Write-Up
    </a>
  </header>

  <main class="main">
    <div class="control-list">
      <div class="control-item">
        <h3 class="item-title">Sock Liner Color</h3>
        <div class="control-content">
          <div class="control-row">
            <div class="placement-graphic">
              <img
                src={sockLinerSketch}
                alt="Placement sketch for the sock liner switch"
              />
            </div>
            <SockLinerSwitch bind:isOn={sockLinerOn} />
          </div>
          {#if showInfo}
            <p class="control-info">
              Double-click to toggle sock liner between white/black. Inner Power
              Control color matches that of the sock liner.
            </p>
          {/if}
        </div>
      </div>

      <div class="control-item">
        <h3 class="item-title">Shoe Color Selector</h3>
        <div class="control-content">
          <div class="control-row">
            <div class="placement-graphic">
              <img
                src={shoeColorSketch}
                alt="Placement sketch for the shoe color selector"
              />
            </div>
            <ShoeColorSelector bind:selectedColor={shoeColor} />
          </div>
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
        <div class="control-content">
          <div class="control-row">
            <div class="placement-graphic">
              <img
                src={movementBoostSketch}
                alt="Placement sketch for the power control"
              />
            </div>
            <PowerControl
              {value}
              {sockLinerOn}
              ringColor={shoeColor}
              bind:mode
            />
          </div>
          {#if showInfo}
            <p class="control-info">
              Displays the remaining energy available to enhance user movement,
              as well as the selected power mode. Click to cycle through Power
              I, Power II, and Recharge modes.
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
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "header"
      "main";
    height: 100vh;
  }

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
    gap: 16px;
    background: #222;
    color: rgb(247, 247, 247);
    padding: 12px 16px;
  }

  .title {
    margin: 0;
    font-size: 1.1rem;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-left: auto;
  }

  .writeup-link {
    color: inherit;
  }

  .item-title {
    align-self: stretch;
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    text-align: center;
  }

  .placement-graphic {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    width: 160px;
    height: 160px;
    border: 1px dashed rgba(0, 0, 0, 0.4);
    padding: 8px;
    text-align: center;
  }

  .placement-graphic img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* crops evenly from top and bottom */
    object-position: center;
  }

  .info-button {
    cursor: pointer;
  }

  .main {
    grid-area: main;
    background: #eee;
    padding: 24px 48px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow-x: auto;
  }

  .control-list {
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 48px;
    justify-content: center;
  }

  .control-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    flex-shrink: 0;
    gap: 12px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  .control-item .item-title {
    color: #000;
  }

  .control-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .control-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .control-info {
    max-width: 320px;
    margin: 0;
    align-self: center;
    font-size: 0.85rem;
    color: #333;
    text-align: center;
  }
</style>
