<script>
  let {
    sockLinerOn = $bindable(false),
    shoeColor = $bindable("#e5490b"),
    activity = $bindable("none"),
    mode = $bindable("single"),
  } = $props();

  // Sequential interaction script; each step's action drives the real app state.
  const startDelay = 2400;
  const steps = [
    {
      label: "Choosing sock liner color...",
      duration: 3200,
      action: () => (sockLinerOn = true),
    },
    {
      label: "Selecting shoe color...",
      duration: 3200,
      action: () => (shoeColor = "#2b7de9"),
    },
    { label: "Walking...", duration: 3200, action: () => (activity = "walk") },
    {
      label: "Stop to increase power",
      duration: 2400,
      action: () => {
        activity = "none";
        mode = "double";
      },
    },
    { label: "Walking...", duration: 2400, action: () => (activity = "walk") },
    {
      label: "Stop to start recharging power",
      duration: 2400,
      action: () => {
        activity = "none";
        mode = "refresh";
      },
    },
    { label: "Running...", duration: 2400, action: () => (activity = "run") },
    {
      label: "Stop to change shoe color...",
      duration: 2400,
      action: () => {
        activity = "none";
        shoeColor = "#e5490b";
      },
    },
  ];

  /** @type {"idle" | "running" | "stopped"} */
  let status = $state("idle");
  let currentAction = $state("Press start to begin the simulation.");
  /** @type {number | undefined} */
  let timeoutId;

  /** @param {number} index */
  function runStep(index) {
    if (index >= steps.length) {
      status = "idle";
      activity = "none";
      currentAction = "Simulation complete.";
      return;
    }

    currentAction = steps[index].label;
    steps[index].action();
    timeoutId = setTimeout(() => runStep(index + 1), steps[index].duration);
  }

  function start() {
    status = "running";
    currentAction = "Starting simulation...";
    timeoutId = setTimeout(() => runStep(0), startDelay);
  }

  function stop() {
    clearTimeout(timeoutId);
    status = "stopped";
    currentAction = "Simulation stopped.";
  }

  function toggle() {
    if (status === "running") {
      stop();
    } else {
      start();
    }
  }
</script>

<div class="simulation-control">
  <button
    type="button"
    class="simulation-button"
    aria-pressed={status === "running"}
    onclick={toggle}
  >
    {status === "running" ? "Stop Simulation" : "Start Simulation"}
  </button>

  <p class="simulation-log" role="status">{currentAction}</p>
</div>

<style>
  .simulation-control {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .simulation-button {
    padding: 8px 12px;
    border: 1px solid #333;
    border-radius: 4px;
    background: #fff;
    color: #333;
    font-size: 1rem;
    cursor: pointer;
  }

  .simulation-button[aria-pressed="true"] {
    background: #333;
    color: #fff;
  }

  .simulation-log {
    margin: 0;
    min-width: 200px;
    max-width: 260px;
    font-size: 0.85rem;
    color: rgb(220, 220, 220);
  }
</style>
