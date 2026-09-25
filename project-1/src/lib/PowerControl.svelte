<script>
  import Icon from "@iconify/svelte";

  let {
    value = 50,
    sockLinerOn = false,
    ringColor = "#e5490b",
    mode = $bindable("single"),
  } = $props();

  const modes = ["single", "double", "refresh"];

  function nextMode() {
    const currentIndex = modes.indexOf(mode);
    mode = modes[(currentIndex + 1) % modes.length];
  }

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let dashOffset = $derived(circumference * (1 - value / 100));
</script>

<div class="power-control-wrapper" style="--ring-color: {ringColor};">
  <svg class="perimeter" viewBox="0 0 112 112" width="112" height="112">
    <circle class="track" cx="56" cy="56" r={radius} />
    <circle
      class="progress"
      cx="56"
      cy="56"
      r={radius}
      stroke-dasharray={circumference}
      stroke-dashoffset={dashOffset}
    />
  </svg>

  <button
    type="button"
    class="power-control"
    data-inverted={sockLinerOn}
    aria-label={`Power mode: ${mode}`}
    onclick={nextMode}
  >
    {#if mode === "single"}
      <Icon icon="at-icons:lightning-bolt" width="32" height="32" />
    {:else if mode === "double"}
      <Icon icon="at-icons:lightning-bolt" width="24" height="24" />
      <Icon icon="at-icons:lightning-bolt" width="24" height="24" />
    {:else}
      <div class="refresh-wrap">
        <span class="refresh-icon">
          <Icon icon="basil:refresh-outline" width="80" height="80" />
        </span>
        <span class="bolt-icon">
          <Icon icon="at-icons:lightning-bolt" width="24" height="24" />
        </span>
      </div>
    {/if}
  </button>
</div>

<style>
  .power-control-wrapper {
    position: relative;
    width: 112px;
    height: 112px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .perimeter {
    position: absolute;
    inset: 0;
    pointer-events: none;
    /* rotate so progress starts at the top instead of the 3 o'clock position */
    transform: rotate(-90deg);
  }

  .track,
  .progress {
    fill: none;
    stroke-width: 8;
  }

  .track {
    stroke: rgba(0, 0, 0, 0.1);
  }

  .progress {
    stroke: var(--ring-color);
    stroke-linecap: round;
    transition:
      stroke-dashoffset 0.2s ease,
      stroke 0.2s ease;
  }

  .power-control {
    width: 96px;
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border: 1px solid #333;
    border-radius: 50%;
    background: #000;
    color: #fff;
    cursor: pointer;
  }

  .power-control[data-inverted="true"] {
    background: #fff;
    color: #000;
  }

  .refresh-wrap {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .refresh-icon {
    position: absolute;
    inset: 0;
  }

  .bolt-icon {
    position: relative;
    top: 4px;
  }
</style>
