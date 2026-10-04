<script>
  // saturation is fixed at 100% so the 2D picker can map hue (x) and lightness (y)
  let { selectedColor = $bindable("#e5490b") } = $props();
  const saturationPercent = 100;
  let hueDegrees = $state(0);
  let lightnessPercent = $state(50);
  /** @type {HTMLDivElement} */
  let colorSquare;
  let isDragging = false;

  /**
   * Converts HSL to a "#rrggbb" string.
   * @param {number} hue 0-360 degrees
   * @param {number} saturation 0-100
   * @param {number} lightness 0-100
   */
  function hslToHex(hue, saturation, lightness) {
    const saturationFraction = saturation / 100;
    const lightnessFraction = lightness / 100;

    // chroma: color intensity; secondary: the middle channel's share of it
    const chroma =
      (1 - Math.abs(2 * lightnessFraction - 1)) * saturationFraction;
    const secondary = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
    const lightnessOffset = lightnessFraction - chroma / 2;

    // Each 60-degree slice of the hue wheel has a different channel order.
    let [red, green, blue] = [0, 0, 0];
    if (hue < 60) [red, green, blue] = [chroma, secondary, 0];
    else if (hue < 120) [red, green, blue] = [secondary, chroma, 0];
    else if (hue < 180) [red, green, blue] = [0, chroma, secondary];
    else if (hue < 240) [red, green, blue] = [0, secondary, chroma];
    else if (hue < 300) [red, green, blue] = [secondary, 0, chroma];
    else [red, green, blue] = [chroma, 0, secondary];

    /** @param {number} channel */
    const channelToHex = (channel) =>
      Math.round((channel + lightnessOffset) * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${channelToHex(red)}${channelToHex(green)}${channelToHex(blue)}`;
  }

  $effect(() => {
    selectedColor = hslToHex(hueDegrees, saturationPercent, lightnessPercent);
  });

  /** @param {PointerEvent} event */
  function updateFromPointer(event) {
    const bounds = colorSquare.getBoundingClientRect();
    const offsetX = Math.min(
      Math.max(event.clientX - bounds.left, 0),
      bounds.width,
    );
    const offsetY = Math.min(
      Math.max(event.clientY - bounds.top, 0),
      bounds.height,
    );
    hueDegrees = (offsetX / bounds.width) * 360;
    lightnessPercent = 100 - (offsetY / bounds.height) * 100;
  }

  /** @param {PointerEvent} event */
  function handlePointerDown(event) {
    isDragging = true;
    colorSquare.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  }

  /** @param {PointerEvent} event */
  function handlePointerMove(event) {
    if (isDragging) updateFromPointer(event);
  }

  /** @param {PointerEvent} event */
  function handlePointerUp(event) {
    isDragging = false;
    colorSquare.releasePointerCapture(event.pointerId);
  }
</script>

<div
  bind:this={colorSquare}
  class="shoe-color-selector"
  style="background:
    linear-gradient(to bottom, #fff, transparent 50%),
    linear-gradient(to top, #000, transparent 50%),
    linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%));"
  role="slider"
  tabindex="0"
  aria-label={`Shoe Color: ${selectedColor}`}
  aria-valuenow={Math.round(hueDegrees)}
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
>
  <div
    class="indicator"
    style="left: {(hueDegrees / 360) * 100}%; top: {100 -
      lightnessPercent}%; background: {selectedColor};"
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
