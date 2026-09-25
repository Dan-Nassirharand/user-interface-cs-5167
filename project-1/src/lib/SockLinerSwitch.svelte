<script>
  import Icon from "@iconify/svelte";

  let { isOn = $bindable(false) } = $props();
</script>

<button
  type="button"
  class="sock-liner-switch"
  aria-pressed={isOn}
  aria-label={`Sock Liner: ${isOn ? "On" : "Off"}`}
  ondblclick={() => (isOn = !isOn)}
>
  <Icon icon="boxicons:sock-filled" width="32" height="32" />
</button>

<style>
  .sock-liner-switch {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 64px;
    padding: 12px;
    border: 1px solid #333;
    border-radius: 4px;
    background: #000;
    color: #fff;
    cursor: pointer;
  }

  .sock-liner-switch[aria-pressed="true"] {
    background: #fff;
    color: #000;
  }
</style>
