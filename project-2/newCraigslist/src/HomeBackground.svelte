<script>
  // Configuration
  const baseSpeed = 25; // Base speed in pixels per second
  const speedVariance = 5; // Slight +/- variance (40 to 50 px/s)
  const rowSpacing = 6; // Vertical spacing percentage between rows (density)
  const startTop = 2; // Starting top offset percentage
  const baseGap = 7; // Base spacing between sentences in rem
  const gapVariance = 4; // Slight random +/- variance in rem (7rem to 13rem)
  const reverseHalf = true; // When true, a random half of the rows scroll the opposite way

  const sentences = [
    "Sell your old Guitar",
    "Hire a student to fix your UI",
    "Sublease your studio apartment",
    "Find a qualified defense attorney",
    "Post to the community lost and found",
    "Find somebody to repair the deck",
    "Search for the perfect roomate",
    "Find a one day film gig",
    "Buy some antiques from a nice grandma",
    "Discuss the upcoming Dunesday premier",
    "Exchange a sweater for a vest",
    "Find a home for a litter of stray kittens",
    "Browse expert resumes in your city",
    "Dontate to a charity",
    "Find a sleek new Hyundai",
    "Find the perfect job fo you",
    "Shop for Bearcat tickets",
    "Find participants for a study",
    "List voluneteering events in my city",
    "Shop for used socks. Or don't.",
    "List advertisers in the area"
  ];

  const colors = [
    "var(--color-primary, #5c2d91)",
    "var(--color-accent, #2563eb)",
    "var(--color-sage, #8a9a86)" // Sage green
  ];

  function getRandomRowSentences(count) {
    return Array.from({ length: count }, () => {
      const idx = Math.floor(Math.random() * sentences.length);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const gap = (baseGap + (Math.random() * (gapVariance * 2) - gapVariance)).toFixed(1);
      return {
        text: sentences[idx],
        color,
        gap: `${gap}rem`
      };
    });
  }

  const totalRows = Math.ceil((100 - startTop) / rowSpacing);
  // Randomly pick half of the rows to scroll in reverse
  const reversedRows = new Set(
    Array.from({ length: totalRows }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(totalRows / 2))
  );

  const rows = Array.from({ length: totalRows }, (_, i) => ({
    items: getRandomRowSentences(6 + Math.floor(Math.random() * 3)),
    speed: baseSpeed + (Math.random() * (speedVariance * 2) - speedVariance),
    reversed: reverseHalf && reversedRows.has(i)
  }));

  // Sets animation duration based on exact width and slightly varied speed
  function setRowAnimation(node, rowSpeed) {
    const group = node.firstElementChild;
    if (!group) return;
    const width = group.getBoundingClientRect().width;
    const duration = width / rowSpeed;
    node.style.animationDuration = `${duration}s`;
    node.style.animationDelay = `${-(Math.random() * duration)}s`;
  }
</script>

<div class="background-container">
  {#each rows as row, i}
    <div
      class="marquee-row"
      style="top: {startTop + (i * rowSpacing)}%;"
    >
      <div
        class="marquee-track"
        class:reverse={row.reversed}
        use:setRowAnimation={row.speed}
      >
        <div class="marquee-group">
          {#each row.items as item}
            <span style="color: {item.color}; margin-right: {item.gap};">{item.text}</span>
          {/each}
        </div>
        <div class="marquee-group" aria-hidden="true">
          {#each row.items as item}
            <span style="color: {item.color}; margin-right: {item.gap};">{item.text}</span>
          {/each}
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .background-container {
    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: -1;
    opacity: 0.20;
  }

  .marquee-row {
    position: absolute;
    left: 0;
    width: 100%;
    white-space: nowrap;
  }

  .marquee-track {
    display: flex;
    width: max-content;
    animation-name: marquee;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    will-change: transform;
  }

  .marquee-group {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    white-space: nowrap;
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .marquee-track.reverse {
    animation-direction: reverse;
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
</style>
