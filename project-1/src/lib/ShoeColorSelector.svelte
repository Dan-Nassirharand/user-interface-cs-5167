<script>
  // TODO: saturation fixed at 100%; trading it away to show hue x lightness instead
  let { selectedColor = $bindable("#e5490b") } = $props();
  const saturation = 100;
  let hue = $state(0);
  let lightness = $state(50);
  /** @type {HTMLDivElement} */
  let squareEl;
  let dragging = false;

  // TODO: refactor for readability

  /**
   * @param {number} h
   * @param {number} s
   * @param {number} l
   */
  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let [r, g, b] = [0, 0, 0];
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    /** @param {number} n */
    const toHex = (n) =>
      Math.round((n + m) * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  $effect(() => {
    selectedColor = hslToHex(hue, saturation, lightness);
  });

  /** @param {PointerEvent} event */
  function updateFromPointer(event) {
    const rect = squareEl.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
    hue = (x / rect.width) * 360;
    lightness = 100 - (y / rect.height) * 100;
  }

  /** @param {PointerEvent} event */
  function handlePointerDown(event) {
    dragging = true;
    squareEl.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  }

  /** @param {PointerEvent} event */
  function handlePointerMove(event) {
    if (dragging) updateFromPointer(event);
  }

  /** @param {PointerEvent} event */
  function handlePointerUp(event) {
    dragging = false;
    squareEl.releasePointerCapture(event.pointerId);
  }
</script>

<div
  bind:this={squareEl}
  class="shoe-color-selector"
  style="background:
    linear-gradient(to bottom, #fff, transparent 50%),
    linear-gradient(to top, #000, transparent 50%),
    linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%));"
  role="slider"
  tabindex="0"
  aria-label={`Shoe Color: ${selectedColor}`}
  aria-valuenow={Math.round(hue)}
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
>
  <div
    class="indicator"
    style="left: {(hue / 360) * 100}%; top: {100 -
      lightness}%; background: {selectedColor};"
  ></div>
</div>

<style>
  .shoe-color-selector {
    position: relative;
    width: 96px;
    height: 64px;
    border: 1px solid #333;
    border-radius: 4px;
    cursor: crosshair;
    touch-action: none;
  }

  .indicator {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px #333;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
</style>
