<script>
  let shoeState = "Welcome to Your Smart Shoes!";

  let heartRate = 120;
  let milesRan = 3.1;

  let minsUntilNextCalendarEvent = 30;

  let stepsToday = 5000;
</script>

<button on:click={() => (shoeState = "Training")}> Training </button>
<button on:click={() => (shoeState = "Commuting")}> Commuting </button>
<button on:click={() => (shoeState = "Recovery")}> Recovery </button>

{#if shoeState === "Training"}
  <p>You are training</p>
  <p>Heart Rate: {heartRate} bpm</p>
  <p>Miles Ran: {milesRan}</p>
{:else if shoeState === "Commuting"}
  <p>You are commuting</p>
  <p>Minutes until next calendar event: {minsUntilNextCalendarEvent}</p>
{:else if shoeState === "Recovery"}
  <p>You are recovering</p>
  <p>Steps today: {stepsToday}</p>
{:else}
  <p>{shoeState}</p>
{/if}
