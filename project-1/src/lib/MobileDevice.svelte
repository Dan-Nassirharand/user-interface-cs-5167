<script>
  let { component, text, actions, onSetPreset, onApplyPreset } = $props();
</script>

<div class="mobile-device">
  <div class="mobile-screen">
    <div class="screen-body">
      {#if component}
        {@render component()}
      {/if}
      {#if text}
        {@render text()}
      {/if}
    </div>
    <div class="screen-actions">
      {#if actions}
        {@render actions()}
      {:else}
        <button type="button" class="preset-button" onclick={onSetPreset}>
          Set Preset
        </button>
        <button
          type="button"
          class="preset-button preset-button--primary"
          onclick={onApplyPreset}
        >
          Apply Preset
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .mobile-device {
    width: 200px;
    height: 360px;
    flex-shrink: 0;
    background: var(--color-secondary);
    border: 2px solid var(--color-secondary);
    border-radius: 24px;
    padding: 10px;
    box-sizing: border-box;
  }

  .mobile-screen {
    width: 100%;
    height: 100%;
    background: var(--color-primary);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .screen-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 24px 16px 12px;
    box-sizing: border-box;
    overflow: hidden;
  }

  /* keep components at their natural size instead of the flex column squashing them */
  .screen-body > :global(*) {
    flex-shrink: 0;
  }

  .screen-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px 16px;
    box-sizing: border-box;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .preset-button {
    border: 1px solid var(--color-secondary);
    border-radius: 6px;
    background: var(--color-quaternary);
    color: var(--color-secondary);
    padding: 8px;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .preset-button--primary {
    background: var(--color-secondary);
    color: var(--color-primary);
    border-color: var(--color-secondary);
  }
</style>
