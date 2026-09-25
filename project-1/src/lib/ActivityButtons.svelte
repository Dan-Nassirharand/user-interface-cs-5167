<script>
  // "none" | "walk" | "run"; clicking the active button again turns it off
  let { activity = $bindable("none") } = $props();

  /** @param {"walk" | "run"} next */
  function setActivity(next) {
    activity = activity === next ? "none" : next;
  }
</script>

<div class="activity-buttons">
  <button
    type="button"
    class="activity-button"
    aria-pressed={activity === "walk"}
    onclick={() => setActivity("walk")}
  >
    Walk
  </button>
  <button
    type="button"
    class="activity-button"
    aria-pressed={activity === "run"}
    onclick={() => setActivity("run")}
  >
    Run
  </button>
</div>

<style>
  .activity-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .activity-button {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #333;
    border-radius: 4px;
    background: #fff;
    color: #333;
    font-size: 1rem;
    cursor: pointer;
  }

  .activity-button[aria-pressed="true"] {
    background: #333;
    color: #fff;
  }
</style>
